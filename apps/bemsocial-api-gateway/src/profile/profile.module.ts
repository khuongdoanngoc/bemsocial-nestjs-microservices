import { Module } from '@nestjs/common'
import { ProfileService } from './profile.service'
import { ProfileController } from './profile.controller'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { AuthModule } from '../auth/auth.module'

@Module({
    imports: [
        AuthModule,
        ClientsModule.register([
            {
                name: 'USER_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: ['amqp://localhost:5672'],
                    queue: 'user_queue',
                    queueOptions: {
                        durable: true,
                    },
                },
            },
        ]),
    ],
    controllers: [ProfileController],
    providers: [ProfileService],
})
export class ProfileModule {}
