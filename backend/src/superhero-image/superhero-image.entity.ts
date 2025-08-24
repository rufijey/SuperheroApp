import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import {Superhero} from "../superhero/superhero.entity";

@Entity()
export class SuperheroImage {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Superhero, (hero) => hero.images, { onDelete: 'CASCADE' })
    @JoinColumn()
    superhero: Superhero;

    @Column()
    path: string;

    @Column()
    url: string;

    @CreateDateColumn()
    createdAt: Date;
}
