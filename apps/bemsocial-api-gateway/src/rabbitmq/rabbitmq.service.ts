import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import * as amqp from 'amqplib'

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
    private connection: amqp.Connection
    private channel: amqp.Channel
    private readonly uri = 'amqp://guest:guest@localhost:5672'

    async onModuleInit() {
        await this.connect()
        await this.setupExchangesAndQueues()
    }

    async onModuleDestroy() {
        await this.disconnect()
    }

    private async connect() {
        try {
            this.connection = await amqp.connect(this.uri, {
                clientProperties: {
                    connection_name: 'bemsocial-api-gateway',
                },
            })
            this.channel = await this.connection.createChannel()
            console.log('✅ Connected to RabbitMQ')
        } catch (error) {
            console.error('❌ Failed to connect to RabbitMQ:', error)
            throw error
        }
    }

    private async setupExchangesAndQueues() {
        // Tạo exchanges - Topic exchange để hỗ trợ wildcard routing patterns
        await this.channel.assertExchange('user.topic', 'topic', { durable: true })

        // API Gateway không cần tạo queues cho consuming, chỉ cần exchange để publish
        // Queues sẽ được tạo bởi User Service (auth.queue và profile.queue)

        console.log('✅ API Gateway RabbitMQ exchanges setup completed')
    }
 
    async request<T>(options: { exchange: string; routingKey: string; payload: any; timeout?: number }): Promise<T> {
        const { exchange, routingKey, payload, timeout = 30000 } = options

        return new Promise(async (resolve, reject) => {
            const correlationId = this.generateUuid()
            const replyTo = await this.channel.assertQueue('', { exclusive: true })

            const timeoutId = setTimeout(() => {
                reject(new Error('Request timeout'))
            }, timeout)

            // Lắng nghe response
            await this.channel.consume(
                replyTo.queue,
                msg => {
                    if (msg && msg.properties.correlationId === correlationId) {
                        clearTimeout(timeoutId)
                        const response = JSON.parse(msg.content.toString())
                        this.channel.ack(msg)

                        // Kiểm tra nếu là error response
                        if (response.error) {
                            const error = new Error(response.message)
                            ;(error as any).statusCode = response.statusCode
                            reject(error)
                        } else {
                            resolve(response)
                        }
                    }
                },
                { noAck: false },
            )

            // Gửi request
            await this.channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(payload)), {
                correlationId,
                replyTo: replyTo.queue,
                persistent: true,
            })
        })
    }

    async publish(options: { exchange: string; routingKey: string; payload: any }): Promise<void> {
        const { exchange, routingKey, payload } = options

        await this.channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(payload)), { persistent: true })
    }

    async subscribe(options: {
        queue: string
        exchange: string
        routingKey: string
        handler: (payload: any) => Promise<any>
    }): Promise<void> {
        const { queue, exchange, routingKey, handler } = options

        // Bind queue to exchange
        await this.channel.bindQueue(queue, exchange, routingKey)

        // Consume messages
        await this.channel.consume(
            queue,
            async msg => {
                if (msg) {
                    try {
                        const payload = JSON.parse(msg.content.toString())
                        const result = await handler(payload)

                        // Nếu có replyTo, gửi response
                        if (msg.properties.replyTo && msg.properties.correlationId) {
                            await this.channel.sendToQueue(
                                msg.properties.replyTo,
                                Buffer.from(JSON.stringify(result)),
                                { correlationId: msg.properties.correlationId },
                            )
                        }

                        this.channel.ack(msg)
                    } catch (error) {
                        console.error('Error processing message:', error)
                        this.channel.nack(msg, false, false)
                    }
                }
            },
            { noAck: false },
        )
    }

    private generateUuid(): string {
        return Math.random().toString(36).substring(2) + Date.now().toString(36)
    }

    private async disconnect() {
        try {
            await this.channel?.close()
            await this.connection?.close()
            console.log('✅ Disconnected from RabbitMQ')
        } catch (error) {
            console.error('❌ Error disconnecting from RabbitMQ:', error)
        }
    }

    getConnection(): amqp.Connection {
        return this.connection
    }

    getChannel(): amqp.Channel {
        return this.channel
    }
}
