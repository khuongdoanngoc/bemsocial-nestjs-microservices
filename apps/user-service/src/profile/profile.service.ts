import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { GetProfileResponseDto } from '@app/contracts/dtos/profile/profile.response.dto'
import { RpcException } from '@nestjs/microservices'
import { ProfileSchema } from './schemas/profile.schema'
import { UserSchema } from '../auth/schemas/user.schema'

@Injectable()
export class ProfileService {
    constructor(
        @InjectModel(ProfileSchema.name)
        private profileModel: Model<ProfileSchema>,
    ) {}

    async getProfileByUserId(userId: string): Promise<GetProfileResponseDto> {
        try {
            const profile = await this.profileModel.findOne({ user: userId }).populate('user').exec()
            if (!profile) {
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Profile not found',
                })
            }
            // After populate, profile.user will be a UserSchema object
            const user = profile.user as unknown as UserSchema

            return this.mapToProfileResponse(user, profile)
        } catch (error) {
            console.log(error)
            throw new RpcException({
                statusCode: error.error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.error.message || 'An unexpected error occurred',
            })
        }
    }

    private mapToProfileResponse(user: UserSchema, profile: ProfileSchema): GetProfileResponseDto {
        const { _id, firstName, lastName, email, avatar = '', createdAt, updatedAt } = user
        const { phone, birthDate } = profile

        return {
            _id,
            firstName,
            lastName,
            email,
            phone,
            birthDate,
            avatar,
            createdAt,
            updatedAt,
        }
    }
}
