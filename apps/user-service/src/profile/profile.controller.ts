import { Controller } from '@nestjs/common'
import { ProfileService } from './profile.service'
import { PROFILE_PATTERN } from '@app/contracts/dtos/profile/profile.pattern'
import { RabbitRPC } from '../rabbitmq/rabbitmq.decorators'
import { GetProfileResponseDto } from '@app/contracts/dtos/profile/profile.response.dto'

@Controller()
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @RabbitRPC({
        exchange: 'user.direct',
        routingKey: PROFILE_PATTERN.GET_PROFILE,
        queue: 'profile_get_profile_queue',
    })
    async getProfileByUserId(payload: { userId: string }): Promise<GetProfileResponseDto> {
        return await this.profileService.getProfileByUserId(payload.userId)
    }
}
