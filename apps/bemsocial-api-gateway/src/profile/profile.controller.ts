import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    Put,
    UseGuards,
    UseInterceptors,
    UploadedFiles,
} from '@nestjs/common'
import { ProfileService } from './profile.service'

import { ApiResponseDto } from '@app/contracts/dtos/api/api.response.dto'
import { GetProfileResponseDto } from '@app/contracts/dtos/profile/profile.response.dto'
import { AuthGuard } from '../auth/guards/auth.guard'
import { UpdateProfileDTO } from '@app/contracts/dtos/profile/profile.request.dto'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
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
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'avatar', maxCount: 1 },
            { name: 'cover', maxCount: 1 },
        ]),
    )
    async updateProfile(
        @Param('id') id: string,
        @Body() updateProfile: UpdateProfileDTO,
        @UploadedFiles() files: { avatar?: Express.Multer.File; cover?: Express.Multer.File },
    ): Promise<ApiResponseDto<GetProfileResponseDto>> {
        const newProfile = await this.profileService.updateProfileByUserID(id, updateProfile, files)
        return {
            statusCode: HttpStatus.OK,
            message: 'Profile updated successfully',
            data: newProfile,
        }
    }
}
