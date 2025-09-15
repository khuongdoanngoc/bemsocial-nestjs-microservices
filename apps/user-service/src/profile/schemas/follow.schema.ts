import { Prop, Schema } from '@nestjs/mongoose'

@Schema({ timestamps: true })
export class FollowSchema {
    @Prop({ type: String })
    id: string

    @Prop({ type: String })
    followerId: string

    @Prop({ type: String })
    followingId: string

    @Prop({ type: Date })
    createdAt: Date
}
