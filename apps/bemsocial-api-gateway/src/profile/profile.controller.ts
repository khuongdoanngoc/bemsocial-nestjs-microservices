import { Controller, Get, HttpStatus, Param, UseGuards } from '@nestjs/common'
import { ProfileService } from './profile.service'

import { ApiResponseDto } from '@app/contracts/dtos/api/api.response.dto'
import { GetProfileResponseDto } from '@app/contracts/dtos/profile/profile.response.dto'
import { AuthGuard } from '../auth/guards/auth.guard'

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @Get(':id')
    @UseGuards(AuthGuard)
    async getProfileByUserId(@Param('id') id: string): Promise<ApiResponseDto<GetProfileResponseDto>> {
        const profile = await this.profileService.getProfileByUserId(id)
        return {
            statusCode: HttpStatus.OK,
            message: 'Profile fetched successfully',
            data: profile,
        }
    }
}
