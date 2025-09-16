import { Controller } from '@nestjs/common'
import { AuthService } from './auth.service'
import { MessagePattern } from '@nestjs/microservices'
import { RefreshTokenDto, SignInDto, SignUpDto } from '@app/contracts/dtos/auth/auth.request.dto'
import { AUTH_PATTERN } from '@app/contracts/dtos/auth/auth.pattern'
import { RefreshTokenResponseDto, SignInResponseDto } from '@app/contracts/dtos/auth/auth.response.dto'
import { User } from './schemas/user.schema'

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @MessagePattern(AUTH_PATTERN.SIGN_UP)
    async signUp(signUpDto: SignUpDto): Promise<User> {
        return await this.authService.signUp(signUpDto)
    }

    @MessagePattern(AUTH_PATTERN.SIGN_IN)
    async signIn(signInDto: SignInDto): Promise<SignInResponseDto> {
        const data = await this.authService.signIn(signInDto)
        await this.authService.saveRefreshToken(data.refreshToken, data.user.id)
        return data
    }

    @MessagePattern(AUTH_PATTERN.REFRESH_TOKEN)
    async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<RefreshTokenResponseDto> {
        return await this.authService.refreshToken(refreshTokenDto)
    }
}
