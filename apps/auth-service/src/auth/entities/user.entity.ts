import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', length: 255 })
    firstName: string

    @Column({ type: 'varchar', length: 255 })
    lastName: string

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string

    @Column({ type: 'varchar', length: 255 })
    password: string

    @Column({
        type: 'enum',
        enum: ['USER', 'SELLER', 'ADMIN'],
        default: 'USER',
    })
    role: 'USER' | 'SELLER' | 'ADMIN'

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
