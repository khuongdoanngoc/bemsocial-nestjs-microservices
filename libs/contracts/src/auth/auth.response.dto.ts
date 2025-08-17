export class SignUpResponseDto {
    user: {
        email: string
        firstName?: string
        lastName?: string
    }
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
