import { Prop, Schema } from '@nestjs/mongoose'
import { UserSchema } from '../../auth/schemas/user.schema'
import { Types } from 'mongoose'

@Schema({ timestamps: true })
export class ProfileSchema {
    @Prop({ type: Types.ObjectId, ref: UserSchema.name })
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
