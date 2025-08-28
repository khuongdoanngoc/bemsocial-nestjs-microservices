import { BaseUser } from '@app/contracts/entities/base-user.entity'
import { Inject, Injectable } from '@nestjs/common'
import { DeepPartial, Repository } from 'typeorm'

@Injectable()
export class UserSyncService<T extends BaseUser> {
    constructor(
        @Inject('USER_REPOSITORY')
        private readonly repository: Repository<T>,
    ) {}

    async syncUser(userId: string, data: DeepPartial<T>): Promise<T> {
        const user = await this.repository.findOne({
            where: { id: userId } as any,
        })

        if (user) {
            return user
        }

        const newUser = this.repository.create(data)
        await this.repository.save(newUser)

        return newUser
    }
}
