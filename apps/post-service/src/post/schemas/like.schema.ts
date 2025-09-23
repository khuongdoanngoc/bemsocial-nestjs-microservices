import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

@Schema({ timestamps: true })
export class Like extends Document {
    @Prop({ type: Types.ObjectId, required: true, ref: 'Post' })
    postId: Types.ObjectId

    @Prop({ type: Types.ObjectId, required: true })
    userId: Types.ObjectId

    @Prop({ type: Date, default: Date.now })
    createdAt: Date
}

export const LikeSchema = SchemaFactory.createForClass(Like)

// Composite index để đảm bảo user chỉ like post 1 lần
LikeSchema.index({ postId: 1, userId: 1 }, { unique: true })
