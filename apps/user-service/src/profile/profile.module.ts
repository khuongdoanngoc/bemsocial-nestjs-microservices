import { Module } from '@nestjs/common'
import { ProfileService } from './profile.service'
import { ProfileController } from './profile.controller'
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose'
import { Profile } from './schemas/profile.schema'

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Profile.name, schema: SchemaFactory.createForClass(Profile) }]),
    ],
    controllers: [ProfileController],
    providers: [ProfileService],
    exports: [ProfileService, MongooseModule],
})
export class ProfileModule {}
