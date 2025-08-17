import { Body, Controller } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Post } from '@nestjs/common'
import { SignUpDto } from '@app/contracts/auth/auth.request.dto'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('sign-up')
    async signUp(@Body() signUpDto: SignUpDto) {
        return await this.authService.signUp(signUpDto)
    }
}
