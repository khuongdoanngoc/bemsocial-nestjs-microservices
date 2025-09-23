import { Controller } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RefreshTokenDto, SignInDto, SignUpDto } from '@app/contracts/dtos/auth/auth.request.dto'
import { AUTH_PATTERN } from '@app/contracts/dtos/auth/auth.pattern'
import {
    RefreshTokenResponseDto,
    SignInResponseDto,
    SignUpResponseDto,
} from '@app/contracts/dtos/auth/auth.response.dto'
import { RabbitRPC } from '../rabbitmq/rabbitmq.decorators'

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @RabbitRPC({
        exchange: 'user.topic',
        routingKey: AUTH_PATTERN.SIGN_UP,
        queue: 'auth.queue', // ✅ Sử dụng queue chính auth.queue
    })
    async signUp(signUpDto: SignUpDto): Promise<SignUpResponseDto> {
        const user = await this.authService.signUp(signUpDto)
        return { ...user.toObject(), _id: user._id.toString() }
    }

    @RabbitRPC({
        exchange: 'user.topic',
        routingKey: AUTH_PATTERN.SIGN_IN,
        queue: 'auth.queue',
    })
    async signIn(signInDto: SignInDto): Promise<SignInResponseDto> {
        console.log('sign in')
        const data = await this.authService.signIn(signInDto)
        await this.authService.saveRefreshToken(data.refreshToken, data.user._id.toString())
        return data as SignInResponseDto
    }

    @RabbitRPC({
        exchange: 'user.topic',
        routingKey: AUTH_PATTERN.REFRESH_TOKEN,
        queue: 'auth.queue', // ✅ Sử dụng queue chính auth.queue
    })
    async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<RefreshTokenResponseDto> {
        return await this.authService.refreshToken(refreshTokenDto)
    }

    @RabbitRPC({
        exchange: 'user.topic',
        routingKey: AUTH_PATTERN.GET_USERS_BY_IDS,
        queue: 'auth.queue',
    })
    async getUsersByIds(payload: { userIds: string[] }) {
        return await this.authService.getUsersByIds(payload.userIds)
    } 
}
