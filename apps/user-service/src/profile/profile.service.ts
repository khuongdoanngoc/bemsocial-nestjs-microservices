import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { GetProfileResponseDto } from '@app/contracts/dtos/profile/profile.response.dto'
import { RpcException } from '@nestjs/microservices'
import { Profile } from './schemas/profile.schema'
import { User } from '../auth/schemas/user.schema'
import { UpdateProfileDTO } from '@app/contracts/dtos/profile/profile.request.dto'
import { AwsS3Service } from '@app/contracts/aws-s3/aws-s3.service'

@Injectable()
export class ProfileService {
    constructor(
        @InjectModel(Profile.name)
        private profileModel: Model<Profile>,

        @InjectModel(User.name)
        private userModel: Model<User>,

        private readonly awsS3Service: AwsS3Service,
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

    async updateProfileByUserId(
        userId: string,
        updateProfileDTO: UpdateProfileDTO,
        files: { avatar?: Express.Multer.File; cover?: Express.Multer.File },
    ): Promise<GetProfileResponseDto> {
        try {
            // Bước 1: Single query để lấy cả User và Profile (1 DB request)
            const profile = await this.profileModel
                .findOne({ user: new Types.ObjectId(userId) })
                .populate('user')
                .select('-password')
                .exec()

            if (!profile) {
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Profile not found',
                })
            }

            const user = profile.user as unknown as User

            if (updateProfileDTO.avatarAction === 'remove' && user.avatar) {
                await this.removeImageUpdate(user.avatar, 'avatar')
                user.avatar = ''
            }

            // Bước 2: Song song xử lý images và prepare update data
            const [newAvatarUrl, newCoverUrl] = await Promise.all([
                // Xử lý avatar
                files?.avatar
                    ? this.processImageUpdate(user.avatar, files.avatar, 'avatar')
                    : Promise.resolve(user.avatar),

                // Xử lý cover
                files?.cover
                    ? this.processImageUpdate(profile.cover, files.cover, 'cover')
                    : Promise.resolve(profile.cover),
            ])

            // Prepare update data
            const userUpdateData: Partial<User> = {
                firstName: updateProfileDTO.firstName || user.firstName,
                lastName: updateProfileDTO.lastName || user.lastName,
                avatar: newAvatarUrl,
            }

            const profileUpdateData: Partial<Profile> = {
                description: updateProfileDTO.description ?? profile.description,
                phone: updateProfileDTO.phone ?? profile.phone,
                birthDate: updateProfileDTO.birthDate ? new Date(updateProfileDTO.birthDate) : profile.birthDate,
                cover: newCoverUrl,
            }

            // Bước 3: Bulk updates song song (2 DB requests song song)
            const [updatedUser, updatedProfile] = await Promise.all([
                this.userModel.findByIdAndUpdate(user._id, userUpdateData, { new: true }).exec(),

                this.profileModel.findByIdAndUpdate(profile._id, profileUpdateData, { new: true }).exec(),
            ])

            // Bước 4: Return từ updated data (không cần query DB thêm)
            return this.mapToProfileResponse(updatedUser!, updatedProfile!)
        } catch (error) {
            console.log(error)
            throw new RpcException({
                statusCode: error.error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.error?.message || 'An unexpected error occurred',
            })
        }
    }

    private async removeImageUpdate(currentImageUrl: string, type: 'avatar' | 'cover'): Promise<string> {
        try {
            // Xóa ảnh cũ nếu có
            if (currentImageUrl) {
                await this.deleteOldImage(currentImageUrl)
            }
            return '' // Trả về chuỗi rỗng để xóa ảnh
        } catch (error) {
            console.log(`Error removing ${type}:`, error)
            return currentImageUrl // Fallback to current image if failed
        }
    }

    // Helper method để xử lý image update
    private async processImageUpdate(
        currentImageUrl: string,
        newImageFile: Express.Multer.File,
        type: 'avatar' | 'cover',
    ): Promise<string> {
        try {
            // Song song: xóa ảnh cũ + upload ảnh mới
            const [, newImageUrl] = await Promise.all([
                // Xóa ảnh cũ nếu có
                currentImageUrl ? this.deleteOldImage(currentImageUrl) : Promise.resolve(),
                // Upload ảnh mới
                this.awsS3Service.uploadFile(newImageFile[0]),
            ])

            return newImageUrl || currentImageUrl
        } catch (error) {
            console.log(`Error processing ${type} update:`, error)
            return currentImageUrl // Fallback to current image if failed
        }
    }

    private async deleteOldImage(imageUrl: string): Promise<void> {
        try {
            console.log('Deleting old image:', imageUrl)
            // Extract key from URL: https://bucket.s3.region.amazonaws.com/uploads/uuid-filename
            const key = imageUrl.split('.amazonaws.com/')[1]
            if (key) {
                await this.awsS3Service.deleteFile(key)
            }
        } catch (error) {
            console.log('Error deleting old image:', error)
            // Không throw error để không ảnh hưởng đến flow chính
        }
    }
}
