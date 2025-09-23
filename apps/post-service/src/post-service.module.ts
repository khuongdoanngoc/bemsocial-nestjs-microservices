import { Module } from '@nestjs/common'
import { RabbitmqModule } from './rabbitmq/rabbitmq.module'
import { PostModule } from './post/post.module'
import { CommentModule } from './comment/comment.module'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
    imports: [
        RabbitmqModule,
        PostModule,
        CommentModule,
        MongooseModule.forRoot(
            process.env.MONGO_URI || 'mongodb://admin:admin@localhost:27017/post_service?authSource=admin',
        ),
    ],
})
export class PostServiceModule {}
