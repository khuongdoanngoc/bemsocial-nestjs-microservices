import { Module } from '@nestjs/common'
import { ProfileService } from './profile.service'
import { ProfileController } from './profile.controller'
import { AuthModule } from '../auth/auth.module'
import { RabbitmqModule } from '../rabbitmq/rabbitmq.module'

@Module({
    imports: [AuthModule, RabbitmqModule],
    controllers: [ProfileController],
    providers: [ProfileService],
})
export class ProfileModule {}
