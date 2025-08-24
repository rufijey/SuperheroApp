import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import {SuperheroImage} from "../superhero-image/superhero-image.entity";

@Entity()
export class Superhero {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nickname: string;

    @Column()
    real_name: string;

    @Column({ type: 'text' })
    origin_description: string;

    @Column({ type: 'text' })
    superpowers: string;

    @Column()
    catch_phrase: string;

    @OneToMany(() => SuperheroImage, (image) => image.superhero, { cascade: true })
    images: SuperheroImage[];
}
