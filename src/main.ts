import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    await app.listen(process.env.PORT ?? 3000);
  } catch (error) {
    console.error('Error starting the server:', error);
    throw error;
  }
}
void bootstrap();
