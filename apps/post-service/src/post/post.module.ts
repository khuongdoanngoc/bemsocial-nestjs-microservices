import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { PostService } from './post.service'
import { PostController } from './post.controller'
import { Post, PostSchema } from './schemas/post.schema'
import { Like, LikeSchema } from './schemas/like.schema'
import { Comment, CommentSchema } from '../comment/schemas/comment.schema'
import { UserClient } from './user.client'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Post.name, schema: PostSchema },
            { name: Like.name, schema: LikeSchema },
            { name: Comment.name, schema: CommentSchema },
        ]),
    ],
    controllers: [PostController],
    providers: [PostService, UserClient],
    exports: [PostService],
})
export class PostModule {}
