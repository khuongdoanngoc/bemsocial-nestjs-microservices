import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { GetProfileResponseDto } from '@app/contracts/dtos/profile/profile.response.dto'
import { RpcException } from '@nestjs/microservices'
import { Profile } from './schemas/profile.schema'
import { User } from '../auth/schemas/user.schema'

@Injectable()
export class ProfileService {
    constructor(
        @InjectModel(Profile.name)
        private profileModel: Model<Profile>,
    ) {}

    async getProfileByUserId(userId: string): Promise<GetProfileResponseDto> {
        try {
            const profile = await this.profileModel
                .findOne({ user: new Types.ObjectId(userId) })
                .populate('user')
                .exec()
            if (!profile) {
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Profile not found',
                })
            }
            const user = profile.user as unknown as User
            return this.mapToProfileResponse(user, profile)
        } catch (error) {
            console.log(error)
            throw new RpcException({
                statusCode: error.error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.error.message || 'An unexpected error occurred',
            })
        }
    }

    private mapToProfileResponse(user: User, profile: Profile): GetProfileResponseDto {
        const { _id, firstName, lastName, email, avatar = '', createdAt, updatedAt } = user
        const { phone, birthDate, cover, description, followers, following } = profile

        return {
            _id,
            firstName,
            lastName,
            email,
            phone,
            birthDate,
            avatar,
            cover,
            description,
            followers,
            following,
            createdAt,
            updatedAt,
        }
    }
}
