import { Module } from '@nestjs/common'
import { ProfileService } from './profile.service'
import { ProfileController } from './profile.controller'
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose'
import { ProfileSchema } from './schemas/profile.schema'

@Module({
    imports: [
        MongooseModule.forFeature([{ name: ProfileSchema.name, schema: SchemaFactory.createForClass(ProfileSchema) }]),
    ],
    controllers: [ProfileController],
    providers: [ProfileService],
})
export class ProfileModule {}
