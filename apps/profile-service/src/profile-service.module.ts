import { Module } from '@nestjs/common'
import { ProfileModule } from './profile/profile.module'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProfileEntity } from './profile/entities/profile.entity'

@Module({
    imports: [
        ProfileModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: 'apps/profile-service/.env',
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.POSTGRES_HOST || 'localhost',
            port: parseInt(process.env.POSTGRES_PORT || '5432'),
            username: process.env.POSTGRES_USER || 'postgres',
            password: process.env.POSTGRES_PASSWORD || 'postgres',
            database: process.env.POSTGRES_DB || 'profile_service',
            entities: [ProfileEntity],
            synchronize: true,
        }),
    ],
})
export class ProfileServiceModule {}
