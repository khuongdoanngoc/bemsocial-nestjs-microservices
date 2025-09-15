import { AUTH_PATTERN } from '@app/contracts/dtos/auth/auth.pattern'
import { RefreshTokenDto, SignInDto, SignUpDto } from '@app/contracts/dtos/auth/auth.request.dto'
import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'

@Injectable()
export class AuthService {
    constructor(@Inject('USER_SERVICE') private readonly client: ClientProxy) {}

    async signUp(signUpDto: SignUpDto) {
        return await lastValueFrom(this.client.send(AUTH_PATTERN.SIGN_UP, signUpDto))
    }

    async signIn(signInDto: SignInDto) {
        return await lastValueFrom(this.client.send(AUTH_PATTERN.SIGN_IN, signInDto))
    }

    async refreshToken(refreshTokenDto: RefreshTokenDto) {
        return await lastValueFrom(this.client.send(AUTH_PATTERN.REFRESH_TOKEN, refreshTokenDto))
    }
}
