import 'dotenv/config';
import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import * as express from 'express';
import {join} from "path";
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization', 'fingerprint'],
        credentials: true,
    });

    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

    app.use('/static', express.static(join(__dirname, '..', 'static')));

    await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

bootstrap();
