import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {SuperheroesController} from "./superhero.controller";
import {SuperheroService} from "./superhero.service";
import {Superhero} from "./superhero.entity";
import {SuperheroImage} from "../superhero-image/superhero-image.entity";
import {SuperheroImageModule} from "../superhero-image/superhero-image.module";

@Module({
    imports: [TypeOrmModule.forFeature([Superhero, SuperheroImage]), SuperheroImageModule],
    controllers: [SuperheroesController],
    providers: [SuperheroService],
})
export class SuperheroModule {}
