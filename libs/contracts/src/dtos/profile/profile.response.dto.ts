import { Types } from 'mongoose'

export class GetProfileResponseDto {
    _id: Types.ObjectId
    firstName: string
    lastName: string
    email: string
    phone: string
    birthDate: Date
    avatar: string
    cover: string
    description: string
    followers: number
    following: number
    createdAt: Date
    updatedAt: Date
}
