import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  // Add CORS to allow Request to API
  app.enableCors();

  // Swagger section, create and deploy api doc
  const options = new DocumentBuilder()
  .setTitle('GPS-Sim Server')
  .setDescription('The GPS-Sim API description')
  .setVersion('1.0')
  .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
