import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { ProfileServiceModule } from './profile-service.module'

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(ProfileServiceModule, {
        transport: Transport.RMQ,
        options: {
            urls: ['amqp://localhost:5672'],
            queue: 'auth_events_queue',
            queueOptions: {
                durable: true,
            },
        },
    })

    await app.listen()
}
bootstrap()
