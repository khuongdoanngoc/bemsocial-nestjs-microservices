
import { BaseUser } from '@app/contracts/entities/base-user.entity'
import { Prop, Schema } from '@nestjs/mongoose'

@Schema({ timestamps: true })
export class User extends BaseUser {
    @Prop({ type: String, required: false, nullable: true })
    password: string
}
