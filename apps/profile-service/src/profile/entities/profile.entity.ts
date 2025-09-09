import { BaseUser } from '@app/contracts/entities/base-user.entity'
import { Column, Entity } from 'typeorm'

@Entity({ name: 'profiles' })
export class ProfileEntity extends BaseUser {
    @Column({ nullable: true, type: 'varchar', length: 255 })
    description: string

    @Column({ nullable: true, type: 'varchar', length: 255 })
    phone: string

    @Column({ nullable: true, type: 'date' })
    birthDate: Date

    @Column({ nullable: true, type: 'varchar', length: 255 })
    cover: string

    @Column({ default: 0 })
    followers: number

    @Column({ default: 0 })
    following: number
}
