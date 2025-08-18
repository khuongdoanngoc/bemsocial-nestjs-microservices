import * as bcrypt from 'bcrypt'
import { RefreshTokenDto, SignInDto, SignUpDto } from '@app/contracts/auth/auth.request.dto'
import { HttpStatus, Injectable } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { RefreshTokenResponseDto, SignInResponseDto, SignUpResponseDto } from '@app/contracts/auth/auth.response.dto'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { plainToInstance } from 'class-transformer'
import { RefreshToken } from './entities/refresh-token.entity'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,

        @InjectRepository(RefreshToken)
        private refreshTokenRepository: Repository<RefreshToken>,

        private jwtService: JwtService,

        private configService: ConfigService,
    ) {}

    async signUp(signUpDto: SignUpDto): Promise<User> {
        try {
            const existingUser = await this.userRepository.findOne({
                where: { email: signUpDto.email },
            })
            if (existingUser) {
                throw new RpcException({ statusCode: HttpStatus.BAD_REQUEST, message: 'User already exists!' })
            }
            const user = this.userRepository.create({
                ...signUpDto,
                password: await bcrypt.hash(signUpDto.password, 10),
            })
            await this.userRepository.save(user)
            return user
        } catch (error) {
            throw new RpcException({ statusCode: error.error.statusCode, message: error.error.message })
        }
    }

    async signIn(signInDto: SignInDto): Promise<SignInResponseDto> {
        try {
            const user = await this.userRepository.findOne({
                where: { email: signInDto.email },
            })
            if (!user) {
                throw new RpcException({ statusCode: HttpStatus.UNAUTHORIZED, message: 'Invalid credentials!' })
            }
            const isPasswordValid = await bcrypt.compare(signInDto.password, user.password)
            if (!isPasswordValid) {
                throw new RpcException({
                    statusCode: HttpStatus.UNAUTHORIZED,
                    message: 'Invalid credentials!',
                    error: 'Un',
                })
            }
            const payload = {
                id: user.id,
                email: user.email,
                role: user.role,
            }
            const accessToken = await this.generateTokens(user, '1h', this.configService.get('JWT_ACCESS_TOKEN_SECRET'))
            const refreshToken = await this.generateTokens(
                user,
                '30d',
                this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
            )
            return {
                accessToken,
                refreshToken,
                user: plainToInstance(SignUpResponseDto, user, { excludeExtraneousValues: true }),
            }
        } catch (error) {
            console.log(error)
            throw new RpcException({ statusCode: error.error.statusCode, message: error.error.message })
        }
    }

    async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<RefreshTokenResponseDto> {
        const refreshTokenEntity = await this.refreshTokenRepository.findOne({
            where: { token: refreshTokenDto.refreshToken },
            relations: ['user'],
        })
        if (!refreshTokenEntity) {
            throw new RpcException({ statusCode: HttpStatus.UNAUTHORIZED, message: 'Invalid refresh token!' })
        }
        if (refreshTokenEntity.expiresAt < new Date()) {
            throw new RpcException({ statusCode: HttpStatus.UNAUTHORIZED, message: 'Refresh token expired!' })
        }
        const accessToken = await this.generateTokens(
            refreshTokenEntity.user,
            '1h',
            this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        )
        return {
            accessToken,
        }
    }

    async saveRefreshToken(refreshToken: string, userId: string) {
        const existingRefreshToken = await this.refreshTokenRepository.findOne({
            where: { user: { id: userId } },
        })
        if (existingRefreshToken) {
            await this.refreshTokenRepository.update(existingRefreshToken.id, {
                token: refreshToken,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            })
        } else {
            await this.refreshTokenRepository.save({
                token: refreshToken,
                user: { id: userId },
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            })
        }
    }

    private async generateTokens(user: User, expiresIn: string, secret: string | undefined) {
        if (!secret) {
            throw new RpcException({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Secret is required!' })
        }
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
        }
        const token = await this.jwtService.sign(payload, {
            expiresIn,
            secret,
        })
        return token
    }
}
