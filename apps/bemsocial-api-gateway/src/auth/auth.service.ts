import { AUTH_PATTERN } from '@app/contracts/dtos/auth/auth.pattern'
import { RefreshTokenDto, SignInDto, SignUpDto } from '@app/contracts/dtos/auth/auth.request.dto'
import { Injectable } from '@nestjs/common'
import { RabbitMQService } from '../rabbitmq/rabbitmq.service'
import { GetMeResponseDto, SignInResponseDto } from '@app/contracts/dtos/auth/auth.response.dto'
import { RefreshTokenResponseDto } from '@app/contracts/dtos/auth/auth.response.dto'
import { SignUpResponseDto } from '@app/contracts/dtos/auth/auth.response.dto'

@Injectable()
export class AuthService {
    constructor(private readonly rabbitMQService: RabbitMQService) {}

    async signUp(signUpDto: SignUpDto) {
        try {
            const user = await this.rabbitMQService.request<SignUpResponseDto>({
                exchange: 'user.topic',
                routingKey: AUTH_PATTERN.SIGN_UP,
                payload: signUpDto,
            })
            console.log(user)
            return user
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async signIn(signInDto: SignInDto) {
        return await this.rabbitMQService.request<SignInResponseDto>({
            exchange: 'user.topic',
            routingKey: AUTH_PATTERN.SIGN_IN,
            payload: signInDto,
        })
    }

    async refreshToken(refreshTokenDto: RefreshTokenDto) {
        return await this.rabbitMQService.request<RefreshTokenResponseDto>({
            exchange: 'user.topic',
            routingKey: AUTH_PATTERN.REFRESH_TOKEN,
            payload: refreshTokenDto,
        })
    }

    async getMe(id: string) {
        const data = await this.rabbitMQService.request<GetMeResponseDto>({
            exchange: 'user.topic',
            routingKey: AUTH_PATTERN.GET_USERS_BY_ID,
            payload: id,
        })
        return data
    }

    async googleAuth(user: any) {
        return await this.rabbitMQService.request<any>({
            exchange: 'user.topic',
            routingKey: AUTH_PATTERN.GOOGLE_AUTH,
            payload: user,
        })
    }
}
