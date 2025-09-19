import { Controller } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RefreshTokenDto, SignInDto, SignUpDto } from '@app/contracts/dtos/auth/auth.request.dto'
import { AUTH_PATTERN } from '@app/contracts/dtos/auth/auth.pattern'
import {
    RefreshTokenResponseDto,
    SignInResponseDto,
    SignUpResponseDto,
} from '@app/contracts/dtos/auth/auth.response.dto'
import { RabbitRPC, RabbitSubscribe } from '../rabbitmq/rabbitmq.decorators'

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @RabbitRPC({
        exchange: 'user.direct',
        routingKey: AUTH_PATTERN.SIGN_UP,
        queue: 'auth_signup_queue', // ✅ Queue riêng cho signup
    })
    async signUp(signUpDto: SignUpDto): Promise<SignUpResponseDto> {
        return await this.authService.signUp(signUpDto)
    }

    @RabbitRPC({
        exchange: 'user.direct',
        routingKey: AUTH_PATTERN.SIGN_IN,
        queue: 'auth_signin_queue', // ✅ Queue riêng cho signin
    })
    async signIn(signInDto: SignInDto): Promise<SignInResponseDto> {
        console.log('sign in')
        const data = await this.authService.signIn(signInDto)
        await this.authService.saveRefreshToken(data.refreshToken, data.user._id.toString())
        return data as SignInResponseDto
    }

    @RabbitRPC({
        exchange: 'user.direct',
        routingKey: AUTH_PATTERN.REFRESH_TOKEN,
        queue: 'auth_refresh_queue', // ✅ Queue riêng cho refresh token
    })
    async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<RefreshTokenResponseDto> {
        return await this.authService.refreshToken(refreshTokenDto)
    }
}
