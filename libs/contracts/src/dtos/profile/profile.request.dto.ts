export interface UpdateProfileDTO {
    firstName: string
    lastName?: string
    description?: string
    avatar: Express.Multer.File
    cover: Express.Multer.File
    phone?: string
    birthDate?: Date | string
    avatarAction?: 'remove' | 'keep'
}
