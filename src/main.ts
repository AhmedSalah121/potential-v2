import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

    // Swagger API Documentation
    const config = new DocumentBuilder()
        .setTitle('NestJS API')
        .setDescription('The API documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    await app.init();
}

bootstrap();

