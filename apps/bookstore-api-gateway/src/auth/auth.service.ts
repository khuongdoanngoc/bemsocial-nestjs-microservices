import { AUTH_PATTERN } from '@app/contracts/auth/auth.pattern'
import { SignUpDto } from '@app/contracts/auth/auth.request.dto'
import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'

@Injectable()
export class AuthService {
    constructor(@Inject('AUTH_SERVICE') private readonly client: ClientProxy) {}

    async signUp(signUpDto: SignUpDto) {
        return await lastValueFrom(this.client.send(AUTH_PATTERN.SIGN_UP, signUpDto))
    }
}
