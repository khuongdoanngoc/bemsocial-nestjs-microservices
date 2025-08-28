import { Controller } from '@nestjs/common'
import { ProfileService } from './profile.service'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { PROFILE_PATTERN } from '@app/contracts/dtos/profile/profile.pattern'

@Controller()
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @MessagePattern(PROFILE_PATTERN.GET_PROFILE)
    async getProfileByUserId(@Payload() payload: { userId: string }) {
        return this.profileService.getProfileByUserId(payload.userId)
    }
}
