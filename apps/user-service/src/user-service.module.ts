import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { ProfileModule } from './profile/profile.module'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
    imports: [
        AuthModule,
        ProfileModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: 'apps/user-service/.env',
        }),
        MongooseModule.forRoot(
            process.env.MONGO_URI || 'mongodb://admin:admin@localhost:27017/bem_social?authSource=admin',
        ), 
    ],
})
export class UserServiceModule {}
