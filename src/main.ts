import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { ConfigService } from './server/config/config.service';
import { SwaggerBaseConfig } from '@nestjs/swagger/dist/interfaces';

function getSwaggerOptions(): SwaggerBaseConfig {
  const options = new DocumentBuilder()
  .setTitle('GPS-Sim Server')
  .setDescription('The GPS-Sim API description')
  .setVersion('1.0')
  .build();

  return options;
}

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  if (config.isCorsEnabled) {
    app.enableCors();
  }

  if (config.isSwaggerApiEnabled) {
    const options = getSwaggerOptions();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(config.port);
}

bootstrap();
