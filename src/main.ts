import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();

async function bootstrap() {
    const app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(server),
    );

    // Enable CORS
    app.enableCors({
        origin: true, // Allow all origins in development, or specify your frontend URL
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });

    await app.init();
}

bootstrap();

export default server;
