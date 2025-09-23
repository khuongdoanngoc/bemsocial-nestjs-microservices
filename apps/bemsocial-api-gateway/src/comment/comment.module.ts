import { Module } from '@nestjs/common'
import { CommentService } from './comment.service'
import { CommentController } from './comment.controller'
import { RabbitmqModule } from '../rabbitmq/rabbitmq.module'
import { AuthModule } from '../auth/auth.module'

@Module({
    imports: [RabbitmqModule, AuthModule],
    controllers: [CommentController],
    providers: [CommentService],
    exports: [CommentService],
})
export class CommentModule {}
