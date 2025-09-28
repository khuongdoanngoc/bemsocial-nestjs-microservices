import { Module } from '@nestjs/common'
import { ProfileService } from './profile.service'
import { ProfileController } from './profile.controller'
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose'
import { Profile } from './schemas/profile.schema'
import { User } from '../auth/schemas/user.schema'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Profile.name, schema: SchemaFactory.createForClass(Profile) },
            { name: User.name, schema: SchemaFactory.createForClass(User) },
        ]),
    ],
    controllers: [ProfileController],
    providers: [ProfileService],
    exports: [ProfileService, MongooseModule],
})
export class ProfileModule {}
