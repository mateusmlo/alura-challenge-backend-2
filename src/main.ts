import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.enableShutdownHooks();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('Finance Control API Docs')
    .addTag('auth')
    .addTag('expenses')
    .addTag('receipts')
    .addTag('summary')
    .addTag('users')
    .setVersion('1.0')
    .build();

  const doc = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, doc);

  await app.listen(3001);
  logger.log(`🔌 Application listening @ localhost:3001`);
}
bootstrap();
