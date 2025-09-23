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
        // Tạo exchanges - Topic exchange để hỗ trợ wildcard routing patterns
        await this.channel.assertExchange('user.topic', 'topic', { durable: true })

        // ✅ Tạo 2 queue chính: auth.queue và profile.queue
        await this.channel.assertQueue('auth.queue', { durable: true })
        await this.channel.assertQueue('profile.queue', { durable: true })

        console.log('✅ User Service RabbitMQ exchanges and queues setup completed')
    } 

    private async registerHandlers() {
        // Tìm controllers và tạo method mappings
        const authMethods = new Map<string, { instance: any; methodName: string }>()
        const profileMethods = new Map<string, { instance: any; methodName: string }>()

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
                const rpcMetadata = this.reflector.get(RABBIT_RPC_HANDLER, methodRef)
                
                if (rpcMetadata) {
                    const { routingKey } = rpcMetadata
                    
                    // Map routing keys to auth or profile methods
                    if (routingKey.startsWith('auth.')) {
                        authMethods.set(routingKey, { instance, methodName })
                    } else if (routingKey.startsWith('profile.')) {
                        profileMethods.set(routingKey, { instance, methodName })
                    }
                }
            }
        }

        // Register queue handlers
        await this.registerQueueHandler('auth.queue', authMethods)
        await this.registerQueueHandler('profile.queue', profileMethods)
    }

    private async registerQueueHandler(
        queueName: string, 
        methodMappings: Map<string, { instance: any; methodName: string }>
    ) {
        // Bind queue to exchange với wildcard pattern
        const routingPattern = queueName === 'auth.queue' ? 'auth.*' : 'profile.*'
        await this.channel.bindQueue(queueName, 'user.topic', routingPattern)

        await this.channel.consume(
            queueName,
            async msg => {
                if (msg) {
                    try {
                        const routingKey = msg.fields.routingKey
                        const payload = JSON.parse(msg.content.toString())
                        
                        // Tìm method tương ứng với routing key
                        const methodInfo = methodMappings.get(routingKey)
                        if (!methodInfo) {
                            console.error(`No handler found for routing key: ${routingKey}`)
                            this.channel.nack(msg, false, false)
                            return
                        }

                        const { instance, methodName } = methodInfo
                        const result = await instance[methodName](payload)

                        // Gửi response nếu có replyTo (RPC pattern)
                        if (msg.properties.replyTo && msg.properties.correlationId) {
                            await this.channel.sendToQueue(
                                msg.properties.replyTo,
                                Buffer.from(JSON.stringify(result)),
                                { correlationId: msg.properties.correlationId },
                            )
                        }

                        this.channel.ack(msg)
                        console.log(`✅ Processed ${routingKey} successfully`)
                    } catch (error) {
                        console.error(`Error processing message in ${queueName}:`, error)

                        // Gửi error response cho RPC pattern
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

                        this.channel.ack(msg) // Ack để không retry
                    }
                }
            },
            { noAck: false },
        )

        console.log(`✅ Registered queue handler for ${queueName} with pattern ${routingPattern}`)
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
