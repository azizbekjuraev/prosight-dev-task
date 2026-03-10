import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = Number(configService.get('PORT'));

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Prosight Application")
    .setDescription("Docs")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, documentFactory);

  await app.listen(port);
}
bootstrap();
