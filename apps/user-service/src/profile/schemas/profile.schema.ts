import { Prop, Schema } from '@nestjs/mongoose'
import { User } from '../../auth/schemas/user.schema'
import { Types } from 'mongoose'

@Schema({ timestamps: true })
export class Profile {
    @Prop({ type: Types.ObjectId, ref: User.name })
    user: Types.ObjectId

    @Prop({ nullable: true, type: String })
    description: string

    @Prop({ nullable: true, type: String })
    phone: string

    @Prop({ nullable: true, type: Date })
    birthDate: Date

    @Prop({ nullable: true, type: String })
    cover: string

    @Prop({ default: 0 })
    followers: number

    @Prop({ default: 0 })
    following: number
}
