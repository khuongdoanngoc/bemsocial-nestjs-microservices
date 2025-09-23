import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { ProfileModule } from './profile/profile.module'
import { RabbitmqModule } from './rabbitmq/rabbitmq.module'
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';

@Module({
    imports: [AuthModule, ProfileModule, RabbitmqModule, PostModule, CommentModule],
})
export class BemSocialApiGatewayModule {}
