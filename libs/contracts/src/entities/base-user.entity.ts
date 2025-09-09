import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { ROLES } from '../dtos/enums/roles.enum'

export abstract class BaseUser {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', length: 255 })
    firstName: string

    @Column({ type: 'varchar', length: 255 })
    lastName: string

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string

    @Column({ type: 'enum', enum: ROLES, default: ROLES.USER })
    role: ROLES

    @Column({ nullable: true, type: 'varchar', length: 255 })
    avatar: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    // Static method to create BaseUser from any source
    static toBaseUser<T extends BaseUser>(source: T): Omit<BaseUser, 'toBaseUser'> {
        return {
            id: source.id,
            firstName: source.firstName,
            lastName: source.lastName,
            email: source.email,
            role: source.role,
            avatar: source.avatar,
            createdAt: source.createdAt,
            updatedAt: source.updatedAt,
        }
    }

    // Instance method
    toBaseUser(): Omit<BaseUser, 'toBaseUser'> {
        return BaseUser.toBaseUser(this)
    }
}
