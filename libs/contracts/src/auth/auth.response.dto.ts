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
    accessToken: string
    refreshToken: string
    user: {
        email: string
        firstName?: string
        lastName?: string
    }
}
