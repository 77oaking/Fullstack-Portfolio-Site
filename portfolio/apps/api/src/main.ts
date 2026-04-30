import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { cors: false });
  const config = app.get(ConfigService);

  // CORS — allowlist from env, comma-separated.
  const origins = (config.get<string>('corsOrigins') ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  app.enableCors({
    origin: origins.length > 0 ? origins : true,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'administrator'],
  });

  // /api/v1/...
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Uniform error envelope on every thrown exception
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger / OpenAPI at /api/docs
  const swagger = new DocumentBuilder()
    .setTitle('Portfolio API')
    .setDescription('Themeable portfolio backend')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', in: 'header', name: 'administrator' }, 'admin')
    .build();
  const swaggerDoc = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('api/docs', app, swaggerDoc);

  const port = config.get<number>('port') ?? 4001;
  await app.listen(port);
  Logger.log(`API listening on http://localhost:${port}`, 'Bootstrap');
  Logger.log(`Swagger docs: http://localhost:${port}/api/docs`, 'Bootstrap');
}

bootstrap();
