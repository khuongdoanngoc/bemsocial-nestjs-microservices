import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { ProfileServiceModule } from './profile-service.module'

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(ProfileServiceModule, {
        transport: Transport.RMQ,
        options: {
            urls: ['amqp://localhost:5672'],
            queue: 'profile_queue',
            queueOptions: {
                durable: true,
                bindingKey: 'user.*',
            },
            exchange: 'exchange.topic',
            exchangeType: 'topic',
            routingKey: '',
        },
    })

    await app.listen()
}
bootstrap()
