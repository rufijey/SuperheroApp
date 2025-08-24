import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {SuperheroImage} from "./superhero-image.entity";
import {SuperheroImageService} from "./superhero-image.service";

@Module({
    imports: [TypeOrmModule.forFeature([SuperheroImage])],
    controllers: [],
    providers: [SuperheroImageService],
    exports: [SuperheroImageService],
})
export class SuperheroImageModule {}
