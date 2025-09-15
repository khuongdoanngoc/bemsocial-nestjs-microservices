import { Module } from '@nestjs/common'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { RefreshTokenSchema } from './schemas/refresh-token.schema'
import { UserSchema } from './schemas/user.schema'
import { JwtService } from '@nestjs/jwt'
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: UserSchema.name, schema: SchemaFactory.createForClass(UserSchema) },
            { name: RefreshTokenSchema.name, schema: SchemaFactory.createForClass(RefreshTokenSchema) },
        ]),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtService],
})
export class AuthModule {}
