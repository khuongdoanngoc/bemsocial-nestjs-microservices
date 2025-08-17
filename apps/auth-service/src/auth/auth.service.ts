import * as bcrypt from 'bcrypt'
import { SignInDto, SignUpDto } from '@app/contracts/auth/auth.request.dto'
import { HttpStatus, Injectable } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
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

    async signIn(signInDto: SignInDto) {
        // Logic for signing in a user
        return {
            message: 'User signed in successfully',
            user: signInDto,
        }
    }
}
