import { Body, Controller, Get, HttpStatus, Param, Put, UseGuards } from '@nestjs/common'
import { ProfileService } from './profile.service'

import { ApiResponseDto } from '@app/contracts/dtos/api/api.response.dto'
import { GetProfileResponseDto } from '@app/contracts/dtos/profile/profile.response.dto'
import { AuthGuard } from '../auth/guards/auth.guard'
import { UpdateProfileDTO } from '@app/contracts/dtos/profile/profile.request.dto'
@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @Get(':id')
    async getProfileByUserId(@Param('id') id: string): Promise<ApiResponseDto<GetProfileResponseDto>> {
        const profile = await this.profileService.getProfileByUserId(id)
        return {
            statusCode: HttpStatus.OK,
            message: 'Profile fetched successfully',
            data: profile,
        }
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    async updateProfile(
        @Param('id') id: string,
        @Body() updateProfile: UpdateProfileDTO,
    ): Promise<ApiResponseDto<GetProfileResponseDto>> {

        const newProfile = await this.profileService.updateProfileByUserID(id, updateProfile)
        return {
            statusCode: HttpStatus.OK,
            message: 'Profile updated successfully',
            data: newProfile,
        }
    }
}
