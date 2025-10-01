import { Module } from '@nestjs/common'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { RefreshToken } from './schemas/refresh-token.schema'
import { User } from './schemas/user.schema'
import { JwtService } from '@nestjs/jwt'
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose'
import { ProfileModule } from '../profile/profile.module'
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: SchemaFactory.createForClass(User) },
            { name: RefreshToken.name, schema: SchemaFactory.createForClass(RefreshToken) },
        ]),
        ProfileModule,
        RabbitMQModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtService],
})
export class AuthModule {}
