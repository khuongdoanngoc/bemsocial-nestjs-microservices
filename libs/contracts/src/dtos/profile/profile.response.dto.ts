import { Types } from 'mongoose'

export class GetProfileResponseDto {
    _id: Types.ObjectId
    firstName: string
    lastName: string
    email: string
    phone: string
    birthDate: Date
    avatar: string
    createdAt: Date
    updatedAt: Date
}
