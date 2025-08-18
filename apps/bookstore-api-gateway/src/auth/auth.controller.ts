import { Body, Controller, HttpStatus } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Post } from '@nestjs/common'
import { SignUpDto } from '@app/contracts/auth/auth.request.dto'
import { ApiResponseDto } from '@app/contracts/dto/api.response.dto'
import { SignUpResponseDto } from '@app/contracts/auth/auth.response.dto'
import { plainToInstance } from 'class-transformer'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('sign-up')
    async signUp(@Body() signUpDto: SignUpDto): Promise<ApiResponseDto<SignUpResponseDto>> {
        const user = await this.authService.signUp(signUpDto)
        const data = plainToInstance(SignUpResponseDto, user, { excludeExtraneousValues: true })
        return {
            statusCode: HttpStatus.CREATED,
            message: 'User signed up successfully!',
            data,
        }
    }
}
