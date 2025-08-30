import { NestFactory } from '@nestjs/core'
import { AuthServiceModule } from './auth-service.module'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthServiceModule, {
        transport: Transport.RMQ,
        options: {
            urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
            queue: 'auth_queue',
            queueOptions: {
                durable: true,
            },
            exchange: 'auth_exchange',
            exchangeType: 'fanout',
        },
    })
    await app.listen()
}
bootstrap()
