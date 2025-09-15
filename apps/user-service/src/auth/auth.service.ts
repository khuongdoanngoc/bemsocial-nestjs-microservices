import * as bcrypt from 'bcrypt'
import { RefreshTokenDto, SignInDto, SignUpDto } from '@app/contracts/dtos/auth/auth.request.dto'
import { HttpStatus, Injectable } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { Model } from 'mongoose'
import { UserSchema } from './schemas/user.schema'
import {
    RefreshTokenResponseDto,
    SignInResponseDto,
    SignUpResponseDto,
} from '@app/contracts/dtos/auth/auth.response.dto'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { plainToInstance } from 'class-transformer'
import { RefreshTokenSchema } from './schemas/refresh-token.schema'
import { InjectModel } from '@nestjs/mongoose'

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(UserSchema.name)
        private userModel: Model<UserSchema>,

        @InjectModel(RefreshTokenSchema.name)
        private refreshTokenModel: Model<RefreshTokenSchema>,

        private jwtService: JwtService,

        private configService: ConfigService,
    ) {}

    async signUp(signUpDto: SignUpDto): Promise<UserSchema> {
        try {
            const existingUser = await this.userModel.findOne({
                email: signUpDto.email,
            })
            if (existingUser) {
                throw new RpcException({ statusCode: HttpStatus.BAD_REQUEST, message: 'User already exists!' })
            }
            const user = new this.userModel({
                ...signUpDto,
                password: await bcrypt.hash(signUpDto.password, 10),
            })
            await user.save()   
            return user
        } catch (error) {
            console.log(error)
            throw new RpcException({
                statusCode: error.error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.error.message || 'An unexpected error occurred',
            })
        }
    }

    private async emitUserCreated(user: UserSchema) {
        const baseUser = user.toBaseUser()
        try {
            // this.authProducer.emit('user.created', baseUser)
        } catch (error) {
            console.log(error)
        }
    }

    async signIn(signInDto: SignInDto): Promise<SignInResponseDto> {
        try {
            const user = await this.userModel.findOne({
                email: signInDto.email,
            })
            if (!user) {
                throw new RpcException({ statusCode: HttpStatus.UNAUTHORIZED, message: 'Invalid credentials!' })
            }
            const isPasswordValid = await bcrypt.compare(signInDto.password, user.password)
            if (!isPasswordValid) {
                throw new RpcException({
                    statusCode: HttpStatus.UNAUTHORIZED,
                    message: 'Invalid credentials!',
                })
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
            throw new RpcException({
                statusCode: error.error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.error.message || 'An unexpected error occurred',
            })
        }
    }

    async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<RefreshTokenResponseDto> {
        const refreshTokenEntity = await this.refreshTokenModel
            .findOne({
                token: refreshTokenDto.refreshToken,
            })
            .populate('user')
        if (!refreshTokenEntity) {
            throw new RpcException({ statusCode: HttpStatus.UNAUTHORIZED, message: 'Invalid refresh token!' })
        }
        if (refreshTokenEntity.expiresAt < new Date()) {
            throw new RpcException({ statusCode: HttpStatus.UNAUTHORIZED, message: 'Refresh token expired!' })
        }
        const accessToken = await this.generateTokens(
            refreshTokenEntity.user as unknown as UserSchema,
            '1h',
            this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        )
        return {
            accessToken,
        }
    }

    async saveRefreshToken(refreshToken: string, userId: string) {
        const existingRefreshToken = await this.refreshTokenModel.findOne({
            user: userId,
        })
        if (existingRefreshToken) {
            await this.refreshTokenModel.updateOne(
                { _id: existingRefreshToken._id },
                {
                    token: refreshToken,
                    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                },
            )
        } else {
            const newRefreshToken = new this.refreshTokenModel({
                token: refreshToken,
                user: userId,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            })
            await newRefreshToken.save()
        }
    }

    private async generateTokens(user: UserSchema, expiresIn: string, secret: string | undefined) {
        if (!secret) {
            throw new RpcException({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Secret is required!' })
        }
        const payload = {
            id: user._id,
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
