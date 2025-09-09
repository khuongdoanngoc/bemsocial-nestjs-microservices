import { ROLES } from '@app/contracts/dtos/enums/roles.enum'
import { BaseUser } from '@app/contracts/entities/base-user.entity'
import { Column, Entity } from 'typeorm'

@Entity({ name: 'users' })
export class User extends BaseUser {
    @Column({ type: 'varchar', length: 255 })
    password: string
}
