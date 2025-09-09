import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { RefreshToken } from './entities/refresh-token.entity'
import { User } from './entities/user.entity'
import { JwtService } from '@nestjs/jwt'
import { ClientsModule, Transport } from '@nestjs/microservices'

@Module({
    imports: [
        TypeOrmModule.forFeature([User, RefreshToken]),
        ClientsModule.register([
            {
                name: 'AUTH_PRODUCER',
                transport: Transport.RMQ,
                options: {
                    urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
                    queue: 'profile_queue',
                    queueOptions: {
                        durable: true,
                    },
                    exchange: 'exchange.topic',
                    exchangeType: 'topic',
                    routingKey: '',
                },
            },
        ]),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtService],
})
export class AuthModule {}
