import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { RefreshToken } from './entities/refresh-token.entity'
import { User } from './entities/user.entity'

@Module({
    imports: [TypeOrmModule.forFeature([User, RefreshToken])],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
