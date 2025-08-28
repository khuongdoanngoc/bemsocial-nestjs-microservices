import { Module } from '@nestjs/common'
import { ProfileService } from './profile.service'
import { ProfileController } from './profile.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProfileEntity } from './entities/profile.entity'
import { UserSyncModule } from '@app/contracts/modules/user-sync/user-sync.module'

@Module({
    imports: [TypeOrmModule.forFeature([ProfileEntity]), UserSyncModule.forFeature(ProfileEntity)],
    controllers: [ProfileController],
    providers: [ProfileService],
})
export class ProfileModule {}
