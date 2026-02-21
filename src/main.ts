import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  });
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Task Scheduler API')
    .setDescription('API Documentation for Task Scheduler')
    .setContact(
      'Ahmed Ossama',
      'https://github.com/Ahmed-Ossamaa/Task-Scheduler',
      'aossama2015@gmail.com',
    )
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
