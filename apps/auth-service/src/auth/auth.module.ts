import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { RefreshToken } from './entities/refresh-token.entity'
import { User } from './entities/user.entity'
import { JwtService } from '@nestjs/jwt'
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices'

@Module({
    imports: [
        TypeOrmModule.forFeature([User, RefreshToken]),
        ClientsModule.register([
            {
                name: 'AUTH_PUBLISHER',
                transport: Transport.RMQ,
                options: {
                    urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
                    queue: 'auth_events_queue',
                    queueOptions: {
                        durable: true,
                    },
                },
            },
        ]),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtService],
})
export class AuthModule {}
