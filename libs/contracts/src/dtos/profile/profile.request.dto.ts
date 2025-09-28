export interface UpdateProfileDTO {
    firstName: string
    lastName?: string
    description?: string
    avatar?: string
    cover?: string
    phone?: string
    birthDate?: Date | string
}
