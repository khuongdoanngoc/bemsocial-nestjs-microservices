import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CommentService } from './comment.service'
import { CommentController } from './comment.controller'
import { Comment, CommentSchema } from './schemas/comment.schema'
import { Post, PostSchema } from '../post/schemas/post.schema'
import { UserClient } from '../post/user.client'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Comment.name, schema: CommentSchema },
            { name: Post.name, schema: PostSchema },
        ]),
    ],
    controllers: [CommentController],
    providers: [CommentService, UserClient],
    exports: [CommentService],
})
export class CommentModule {}
