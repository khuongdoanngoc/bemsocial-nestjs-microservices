import { Module } from '@nestjs/common'
import { PostService } from './post.service'
import { PostController } from './post.controller'
import { RabbitmqModule } from '../rabbitmq/rabbitmq.module'
import { AuthModule } from '../auth/auth.module'

@Module({
    imports: [RabbitmqModule, AuthModule],
    controllers: [PostController],
    providers: [PostService],
    exports: [PostService],
})
export class PostModule {}
