import { Body, Controller, Get, HttpCode, HttpStatus, Req, Res } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Post } from '@nestjs/common'
import { SignInDto, SignUpDto } from '@app/contracts/dtos/auth/auth.request.dto'
import { ApiResponseDto } from '@app/contracts/dtos/api/api.response.dto'
import {
    GetMeResponseDto,
    RefreshTokenResponseDto,
    SignInResponseDto,
    SignUpResponseDto,
} from '@app/contracts/dtos/auth/auth.response.dto'
import { Public } from './decorators/public.decorator'
import { Request, Response } from 'express'

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
    @HttpCode(HttpStatus.OK)
    @Post('sign-in')
    async signIn(
        @Body() signInDto: SignInDto,
        @Res({ passthrough: true }) response: Response,
    ): Promise<ApiResponseDto<SignInResponseDto>> {
        const user = await this.authService.signIn(signInDto)
        response.cookie('refresh-token', user.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        })
        return {
            statusCode: HttpStatus.OK,
            message: 'User signed in successfully!',
            data: user,
        }
    }

    @Public()
    @Post('refresh-token')
    async refreshToken(@Req() request: Request): Promise<ApiResponseDto<RefreshTokenResponseDto>> {
        const refreshTokenDto = {
            refreshToken: request.cookies['refresh-token'],
        }
        const data = await this.authService.refreshToken(refreshTokenDto)
        return {
            statusCode: HttpStatus.OK,
            message: 'Token refreshed successfully!',
            data,
        }
    }

    @Get('me')
    async getMe(@Req() request): Promise<ApiResponseDto<GetMeResponseDto>> {
        const data = await this.authService.getMe(request.user.id)
        return {
            statusCode: HttpStatus.OK,
            message: 'User fetched successfully!',
            data,
        }
    }
}
