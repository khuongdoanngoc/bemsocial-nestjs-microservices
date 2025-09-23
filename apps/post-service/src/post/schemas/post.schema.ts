import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

@Schema({ timestamps: true })
export class Post extends Document {
    @Prop({ type: Types.ObjectId, required: true })
    userId: Types.ObjectId

    @Prop({ type: String, required: true })
    content: string

    @Prop({ type: [String], default: [] })
    images: string[]

    @Prop({ type: Number, default: 0 })
    likesCount: number

    @Prop({ type: Number, default: 0 })
    commentsCount: number

    @Prop({ type: Date, default: Date.now })
    createdAt: Date

    @Prop({ type: Date, default: Date.now })
    updatedAt: Date
}

export const PostSchema = SchemaFactory.createForClass(Post)
