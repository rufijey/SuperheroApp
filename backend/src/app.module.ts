import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as process from 'node:process';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Superhero} from "./superhero/superhero.entity";
import {SuperheroImage} from "./superhero-image/superhero-image.entity";
import {SuperheroModule} from "./superhero/superhero.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            entities: [Superhero, SuperheroImage],
            synchronize: true,
        }),
        SuperheroModule
    ],
})
export class AppModule {
}
