import { DynamicModule, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { UserSyncService } from './user-sync.service'
import { UserSyncController } from './user-sync.controller'

@Module({
    controllers: [],
    providers: [],
})
export class UserSyncModule {
    static forFeature<T>(entity: new () => T): DynamicModule {
        return {
            module: UserSyncModule,
            imports: [
                TypeOrmModule.forFeature([entity]),
            ],
            controllers: [UserSyncController],
            providers: [
                {
                    provide: 'USER_REPOSITORY',
                    useFactory: (repository) => repository,
                    inject: [getRepositoryToken(entity)],
                },
                UserSyncService,
            ],
            exports: [UserSyncService],
        }
    }
}
