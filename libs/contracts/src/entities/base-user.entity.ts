import { Prop, Schema } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { ROLES } from '../dtos/enums/roles.enum'
import { PROVIDERS } from '../dtos/enums/providers.enum'

@Schema({ timestamps: true })
export abstract class BaseUser extends Document {
    declare _id: Types.ObjectId

    @Prop({ required: true })
    firstName: string

    @Prop({ nullable: true, default: '' })
    lastName: string

    @Prop({ required: true, unique: true })
    email: string

    @Prop({ type: String, enum: ROLES, default: ROLES.USER })
    role: ROLES

    @Prop({ nullable: true, default: '' })
    avatar: string

    @Prop({ nullable: true, default: null })
    googleId: string

    @Prop({ type: String, enum: PROVIDERS, nullable: true, default: PROVIDERS.LOCAL })
    provider: PROVIDERS

    @Prop({ type: Date, default: Date.now })
    createdAt: Date

    @Prop({ type: Date, default: Date.now })
    updatedAt: Date

    // Static method to create BaseUser from any source
    static toBaseUser<T extends BaseUser>(source: T): Omit<BaseUser, 'toBaseUser'> {
        return {
            id: source._id,
            firstName: source.firstName,
            lastName: source.lastName,
            email: source.email,
            role: source.role,
            avatar: source.avatar,
            createdAt: source.createdAt,
            updatedAt: source.updatedAt,
        } as any
    }

    // Instance method
    toBaseUser(): Omit<BaseUser, 'toBaseUser'> {
        return BaseUser.toBaseUser(this)
    }
}
