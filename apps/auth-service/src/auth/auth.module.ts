import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { RefreshToken } from './entities/refresh-token.entity'
import { User } from './entities/user.entity'
import { JwtService } from '@nestjs/jwt'

@Module({
    imports: [TypeOrmModule.forFeature([User, RefreshToken])],
    controllers: [AuthController],  
    providers: [AuthService, JwtService],
})
export class AuthModule {}
