import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import * as amqp from 'amqplib'

@Injectable()
export class UserClient implements OnModuleInit, OnModuleDestroy {
    private connection: amqp.Connection
    private channel: amqp.Channel
    private readonly uri = 'amqp://guest:guest@localhost:5672'

    async onModuleInit() {
        try {
            this.connection = await amqp.connect(this.uri, {
                clientProperties: {
                    connection_name: 'post-service-user-client',
                },
            })
            this.channel = await this.connection.createChannel()
            console.log('✅ Post Service User Client connected to RabbitMQ')
        } catch (error) {
            console.error('❌ Post Service User Client failed to connect to RabbitMQ:', error)
            throw error
        }
    }

    async onModuleDestroy() {
        try {
            await this.channel?.close()
            await this.connection?.close()
            console.log('✅ Post Service User Client disconnected from RabbitMQ')
        } catch (error) {
            console.error('❌ Post Service User Client error disconnecting from RabbitMQ:', error)
        }
    }

    async getUsersByIds(userIds: string[]): Promise<any[]> {
        if (!userIds || userIds.length === 0) {
            return []
        }

        const correlationId = Math.random().toString()
        const replyQueue = await this.channel.assertQueue('', { exclusive: true })

        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Request timeout'))
            }, 5000)

            this.channel.consume(
                replyQueue.queue,
                (msg) => {
                    if (msg?.properties.correlationId === correlationId) {
                        clearTimeout(timeout)
                        const response = JSON.parse(msg.content.toString())
                        
                        if (response.error) {
                            reject(new Error(response.message || 'User service error'))
                        } else {
                            resolve(response)
                        }
                        this.channel.ack(msg)
                    }
                },
                { noAck: false }
            )

            // Gửi message đến user service với routing key
            this.channel.publish(
                'user.topic',
                'auth.get-users-by-ids',
                Buffer.from(JSON.stringify({ userIds })),
                {
                    correlationId,
                    replyTo: replyQueue.queue,
                }
            )
        })
    }
}
