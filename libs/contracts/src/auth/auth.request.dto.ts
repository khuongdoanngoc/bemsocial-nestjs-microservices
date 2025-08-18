import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator'

export class SignUpDto {
    @IsEmail({}, { message: 'Invalid email!' })
    @IsNotEmpty({ message: 'Email is required!' })
    email: string

    @IsNotEmpty({ message: 'Password is required!' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message:
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character!',
    })
    password: string

    @IsString({ message: 'First name must be a string' })
    @IsNotEmpty({ message: 'First name is required!' })
    firstName: string

    lastName: string
}

export class SignInDto {
    @IsEmail({}, { message: 'Invalid email!' })
    @IsNotEmpty({ message: 'Email is required!' })
    email: string

    @IsString({ message: 'Password must be a string' })
    @IsNotEmpty({ message: 'Password is required!' })
    password: string
}
