import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { ModuleRef, Reflector } from '@nestjs/core'
import { DiscoveryService, MetadataScanner } from '@nestjs/core'
import * as amqp from 'amqplib'
import { RABBIT_HANDLER, RABBIT_RPC_HANDLER } from './rabbitmq.decorators'

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
    private connection: amqp.Connection
    private channel: amqp.Channel
    private readonly uri = 'amqp://guest:guest@localhost:5672'

    constructor(
        private readonly discoveryService: DiscoveryService,
        private readonly metadataScanner: MetadataScanner,
        private readonly reflector: Reflector,
        private readonly moduleRef: ModuleRef,
    ) {}

    async onModuleInit() {
        await this.connect()
        await this.setupExchangesAndQueues()
        await this.registerHandlers()
    }

    async onModuleDestroy() {
        await this.disconnect()
    }

    private async connect() {
        try {
            this.connection = await amqp.connect(this.uri, {
                clientProperties: {
                    connection_name: 'user-service',
                },
            })
            this.channel = await this.connection.createChannel()
            console.log('✅ User Service connected to RabbitMQ')
        } catch (error) {
            console.error('❌ User Service failed to connect to RabbitMQ:', error)
            throw error
        }
    }

    private async setupExchangesAndQueues() {
        // Tạo exchanges
        await this.channel.assertExchange('user.direct', 'direct', { durable: true })

        // ✅ Tạo queues riêng biệt cho mỗi auth operation
        await this.channel.assertQueue('auth_signup_queue', { durable: true      })
        await this.channel.assertQueue('auth_signin_queue', { durable: true })
        await this.channel.assertQueue('auth_refresh_queue', { durable: true })
        await this.channel.assertQueue('profile_get_profile_queue', { durable: true })
        await this.channel.assertQueue('profile_update_profile_queue', { durable: true })

        console.log('✅ User Service RabbitMQ exchanges and queues setup completed')
    } 

    private async registerHandlers() {
        const controllers = this.discoveryService.getControllers()

        for (const controller of controllers) {
            const { instance } = controller
            const controllerClass = Object.getPrototypeOf(instance)

            const methodNames = this.metadataScanner.scanFromPrototype(
                instance,
                controllerClass,
                methodName => methodName,
            )

            for (const methodName of methodNames) {
                const methodRef = instance[methodName]

                // Check for RabbitSubscribe
                const subscribeMetadata = this.reflector.get(RABBIT_HANDLER, methodRef)
                if (subscribeMetadata) {
                    await this.registerSubscribeHandler(instance, methodName, subscribeMetadata)
                }

                // Check for RabbitRPC
                const rpcMetadata = this.reflector.get(RABBIT_RPC_HANDLER, methodRef)
                if (rpcMetadata) {
                    await this.registerRPCHandler(instance, methodName, rpcMetadata)
                }
            }
        }
    }

    private async registerSubscribeHandler(instance: any, methodName: string, metadata: any) {
        const { exchange, routingKey, queue } = metadata

        await this.channel.bindQueue(queue, exchange, routingKey)

        await this.channel.consume(
            queue,
            async msg => {
                if (msg) {
                    try {
                        const payload = JSON.parse(msg.content.toString())
                        await instance[methodName](payload)
                        this.channel.ack(msg)
                    } catch (error) {
                        console.error(`Error in ${methodName}:`, error)
                        this.channel.nack(msg, false, false)
                    }
                }
            },
            { noAck: false },
        )

        console.log(`✅ Registered subscribe handler: ${methodName} for ${routingKey}`)
    }

    private async registerRPCHandler(instance: any, methodName: string, metadata: any) {
        const { exchange, routingKey, queue } = metadata

        await this.channel.bindQueue(queue, exchange, routingKey)

        await this.channel.consume(
            queue,
            async msg => {
                if (msg) {
                    try {
                        const payload = JSON.parse(msg.content.toString())
                        const result = await instance[methodName](payload)

                        if (msg.properties.replyTo && msg.properties.correlationId) {
                            await this.channel.sendToQueue(
                                msg.properties.replyTo,
                                Buffer.from(JSON.stringify(result)),
                                { correlationId: msg.properties.correlationId },
                            )
                        }

                        this.channel.ack(msg)
                    } catch (error) {
                        console.error(`Error in RPC ${methodName}:`, error)

                        // Gửi error response thay vì chỉ nack
                        if (msg.properties.replyTo && msg.properties.correlationId) {
                            const errorResponse = {
                                error: true,
                                statusCode: error.error?.statusCode || error.statusCode || 500,
                                message: error.error?.message || error.message || 'Internal server error',
                            }

                            try {
                                await this.channel.sendToQueue(
                                    msg.properties.replyTo,
                                    Buffer.from(JSON.stringify(errorResponse)),
                                    { correlationId: msg.properties.correlationId },
                                )
                            } catch (sendError) {
                                console.error(`Failed to send error response:`, sendError)
                            }
                        }

                        this.channel.ack(msg) // Ack message để không retry
                    }
                }
            },
            { noAck: false },
        )

        console.log(`✅ Registered RPC handler: ${methodName} for ${routingKey}`)
    }

    private async disconnect() {
        try {
            await this.channel?.close()
            await this.connection?.close()
            console.log('✅ User Service disconnected from RabbitMQ')
        } catch (error) {
            console.error('❌ User Service error disconnecting from RabbitMQ:', error)
        }
    }
}
