import { Controller } from '@nestjs/common'
import { UserSyncService } from './user-sync.service'
import { EventPattern } from '@nestjs/microservices'

@Controller()
export class UserSyncController {
    constructor(private readonly userSyncService: UserSyncService<any>) {}

    @EventPattern('user.created')
    async handleUserCreated(data: any) {
        console.log('user created', data)
        return this.userSyncService.syncUser(data.id, data)
    }
}
