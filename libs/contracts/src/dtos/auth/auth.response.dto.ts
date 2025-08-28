import { Expose } from 'class-transformer'

export class SignUpResponseDto {
    @Expose()
    id: string

    @Expose()
    email: string

    @Expose()
    firstName: string

    @Expose()
    lastName: string

    @Expose()
    role: string

    @Expose()
    createdAt: Date

    @Expose()
    updatedAt: Date
}

export class SignInResponseDto {
    @Expose()
    accessToken: string

    @Expose()
    refreshToken: string

    @Expose()
    user: SignUpResponseDto
}

export class RefreshTokenResponseDto {
    @Expose()
    accessToken: string
}
