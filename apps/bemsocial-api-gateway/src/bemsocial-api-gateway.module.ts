import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { ProfileModule } from './profile/profile.module'
import { RabbitmqModule } from './rabbitmq/rabbitmq.module'

@Module({
    imports: [AuthModule, ProfileModule, RabbitmqModule],
})
export class BemSocialApiGatewayModule {}
