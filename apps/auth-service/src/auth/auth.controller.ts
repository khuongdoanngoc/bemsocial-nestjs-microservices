import { Controller, HttpStatus } from '@nestjs/common'
import { AuthService } from './auth.service'
import { MessagePattern } from '@nestjs/microservices'
import { SignUpDto } from '@app/contracts/auth/auth.request.dto'
import { AUTH_PATTERN } from '@app/contracts/auth/auth.pattern'
import { ApiResponseDto } from '@app/contracts/dto/api.response.dto'
import { User } from './entities/user.entity'

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @MessagePattern(AUTH_PATTERN.SIGN_UP)
    async signUp(signUpDto: SignUpDto): Promise<ApiResponseDto<User>> {
        const user = await this.authService.signUp(signUpDto)
        return {
            statusCode: HttpStatus.CREATED,
            message: 'User signed up successfully',
            data: user,
        }
    }
}
