import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * NodeJS Entrypoint
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
