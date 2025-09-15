import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ConfigModule } from '@nestjs/config'
import { AuthGuard } from './guards/auth.guard'
import { RolesGuard } from './guards/roles.guard'

@Module({
    imports: [
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
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: 'apps/bemsocial-api-gateway/.env',
        }),
        JwtModule.register({}),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        RolesGuard,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
    exports: [JwtModule],
})
export class AuthModule {}
