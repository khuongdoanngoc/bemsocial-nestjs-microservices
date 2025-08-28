import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ProfileEntity } from './entities/profile.entity'
import { GetProfileResponseDto } from '@app/contracts/dtos/profile/profile.response.dto'
import { RpcException } from '@nestjs/microservices'

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(ProfileEntity)
        private profileRepository: Repository<ProfileEntity>,
    ) {}

    async getProfileByUserId(userId: string): Promise<GetProfileResponseDto> {
        try {
            const profile = await this.profileRepository.findOne({ where: { id: userId } })
            if (!profile) {
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Profile not found',
                })
            }
            return profile
        } catch (error) {
            console.log(error)
            throw new RpcException({
                statusCode: error.error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.error.message || 'An unexpected error occurred',
            })
        }
    }
}
