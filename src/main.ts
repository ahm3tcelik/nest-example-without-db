import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { swaggerConfig } from './config/swagger.config';
import { HttpExceptionFilter } from './modules/core/filters/http-exception.filter';
import { ResponseTransform } from './modules/core/interceptors/response.transform';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  // app.useGlobalInterceptors(new ResponseTransform())

  await app.listen(3000);
}
bootstrap();
