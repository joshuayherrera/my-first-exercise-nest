import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'tasks' })
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length:255, nullable: false })
    title: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'boolean', default: false })
    isDone: boolean;
}
