import { NestFactory } from '@nestjs/core'
import { BookServiceModule } from './book-service.module'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(BookServiceModule, {
        transport: Transport.RMQ,
        options: {
            urls: [process.env.RMQ_URL ?? 'amqp://localhost:5672'],
            queue: 'books_queue',
            queueOptions: {
                durable: true,
            },
        },
    })
    await app.listen()
}
bootstrap()
