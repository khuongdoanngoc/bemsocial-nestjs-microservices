import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

@Schema({ timestamps: true })
export class Comment extends Document {
    @Prop({ type: String, required: true })
    content: string

    @Prop({ type: Types.ObjectId, required: true, ref: 'Post' })
    postId: Types.ObjectId

    @Prop({ type: Types.ObjectId, required: true })
    userId: Types.ObjectId

    @Prop({ type: Types.ObjectId, ref: 'Comment', default: null })
    parentId?: Types.ObjectId

    @Prop({ type: Number, default: 0 })
    repliesCount: number

    @Prop({ type: Date, default: Date.now })
    createdAt: Date

    @Prop({ type: Date, default: Date.now })
    updatedAt: Date
}

export const CommentSchema = SchemaFactory.createForClass(Comment)

// Index for efficient querying
CommentSchema.index({ postId: 1, createdAt: -1 })
CommentSchema.index({ parentId: 1, createdAt: -1 })