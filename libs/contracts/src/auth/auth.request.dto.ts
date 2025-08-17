import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class SignUpDto {
    @IsEmail({}, { message: 'Invalid email!' })
    @IsNotEmpty({ message: 'Email is required!' })
    email: string

    @IsString({ message: 'Password must be a string' })
    @IsNotEmpty({ message: 'Password is required!' })
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
