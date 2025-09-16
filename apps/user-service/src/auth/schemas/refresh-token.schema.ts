import { Schema, Prop } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { User } from './user.schema'

@Schema({ timestamps: true })
export class RefreshToken {
    @Prop({ type: String })
    id: string

    @Prop({ type: String })
    token: string

    @Prop({ type: Types.ObjectId, ref: User.name })
    user: Types.ObjectId

    @Prop({ type: Date, default: Date.now })
    expiresAt: Date

    @Prop({ type: Date, default: Date.now })
    createdAt: Date
}
