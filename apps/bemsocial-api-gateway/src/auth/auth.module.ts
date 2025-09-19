import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { ConfigModule } from '@nestjs/config'
import { AuthGuard } from './guards/auth.guard'
import { RolesGuard } from './guards/roles.guard'
import { RabbitmqModule } from '../rabbitmq/rabbitmq.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: 'apps/bemsocial-api-gateway/.env',
        }),
        JwtModule.register({}),
        RabbitmqModule,
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ],
    exports: [JwtModule],
})
export class AuthModule {} 
