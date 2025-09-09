import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity()
export class FollowEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'uuid' })
    followerId: string

    @Column({ type: 'uuid' })
    followingId: string

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date
}
