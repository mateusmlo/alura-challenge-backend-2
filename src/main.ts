import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create(AppModule);
  await app.listen(3001);

  logger.log(`🔌 Application listening @ localhost:3001`);
}
bootstrap();
