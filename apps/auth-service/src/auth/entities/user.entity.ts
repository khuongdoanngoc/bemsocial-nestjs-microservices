import { BaseUser } from '@app/contracts/entities/base-user.entity'
import { Column, Entity } from 'typeorm'

@Entity({ name: 'users' })
export class User extends BaseUser {
    @Column({ type: 'varchar', length: 255 })
    password: string

    @Column({
        type: 'enum',
        enum: ['USER', 'SELLER', 'ADMIN'],
        default: 'USER',
    })
    role: 'USER' | 'SELLER' | 'ADMIN'
}
