import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { LoggerMiddleware } from "./middlewares/logger.middleware";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as dotenv from "dotenv";
import cookieParser = require("cookie-parser");

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "http://localhost:3005",
    credentials: true,
  });

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // forbidNonWhitelisted: true,
      transform: true,
    })
  );

  //Usa mi midleware para registrar logs
  app.use(LoggerMiddleware);

  //Coonfiguración documentación
  const swaggerConfig = new DocumentBuilder()
    .setTitle("TicketLive API")
    .setDescription("API documentation")
    .setVersion("1.0.0")
    .addBearerAuth()
    .build(); //Clase para documentacion OPENAPI 3.0

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api", app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
}
bootstrap();
