import { PROFILE_PATTERN } from '@app/contracts/dtos/profile/profile.pattern'
import { GetProfileResponseDto } from '@app/contracts/dtos/profile/profile.response.dto'
import { Injectable } from '@nestjs/common'
import { RabbitMQService } from '../rabbitmq/rabbitmq.service'
import { UpdateProfileDTO } from '@app/contracts/dtos/profile/profile.request.dto'

@Injectable()
export class ProfileService {
    constructor(private readonly rabbitMQService: RabbitMQService) {}

    async getProfileByUserId(userId: string): Promise<GetProfileResponseDto> {
        return await this.rabbitMQService.request<GetProfileResponseDto>({
            exchange: 'user.topic',
            routingKey: PROFILE_PATTERN.GET_PROFILE,
            payload: { userId },
        })
    }

    async updateProfileByUserID(userId: string, updateProfile: UpdateProfileDTO): Promise<GetProfileResponseDto> {
        return await this.rabbitMQService.request<GetProfileResponseDto>({
            exchange: 'user.topic',
            routingKey: PROFILE_PATTERN.UPDATE_PROFILE,
            payload: { userId, updateProfile },
        })
    }
}
