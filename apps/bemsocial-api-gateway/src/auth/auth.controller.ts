import { Body, Controller, HttpStatus } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Post } from '@nestjs/common'
import { RefreshTokenDto, SignInDto, SignUpDto } from '@app/contracts/dtos/auth/auth.request.dto'
import { ApiResponseDto } from '@app/contracts/dtos/api/api.response.dto'
import {
    RefreshTokenResponseDto,
    SignInResponseDto,
    SignUpResponseDto,
} from '@app/contracts/dtos/auth/auth.response.dto'
import { Public } from './decorators/public.decorator'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post('sign-up')
    async signUp(@Body() signUpDto: SignUpDto): Promise<ApiResponseDto<SignUpResponseDto>> {
        const user = await this.authService.signUp(signUpDto)
        const data = user as SignUpResponseDto
        return {
            statusCode: HttpStatus.CREATED,
            message: 'User signed up successfully!',
            data,
        }
    }

    @Public()
    @Post('sign-in')
    async signIn(@Body() signInDto: SignInDto): Promise<ApiResponseDto<SignInResponseDto>> {
        const user = await this.authService.signIn(signInDto)
        return {
            statusCode: HttpStatus.OK,
            message: 'User signed in successfully!',
            data: user,
        }
    }

    @Public()
    @Post('refresh-token')
    async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<ApiResponseDto<RefreshTokenResponseDto>> {
        const data = await this.authService.refreshToken(refreshTokenDto)
        return {
            statusCode: HttpStatus.OK,
            message: 'Token refreshed successfully!',
            data,
        }
    }
}
