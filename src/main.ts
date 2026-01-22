import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { LoggerMiddleware } from "./middlewares/logger.middleware";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
  // ✅ Log corto para confirmar que se cargó el .env (borra después)
  console.log("ENV CHECK", {
    DB_HOST: process.env.DB_HOST,
    DB_PASSWORD_TYPE: typeof process.env.DB_PASSWORD,
    MAIL_HOST: process.env.MAIL_HOST,
    MAIL_PORT: process.env.MAIL_PORT,
    NODE_ENV: process.env.NODE_ENV,
  });

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ✅ Deploy detrás de proxy (Render). No rompe local.
  app.set("trust proxy", 1);

  const FRONTEND_URL = process.env.FRONTEND_URL || process.env.FRONT_URL;

  const allowedOrigins = ["http://localhost:3005", FRONTEND_URL].filter(
    (v): v is string => typeof v === "string"
  );

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );

  app.use(LoggerMiddleware);

  const swaggerConfig = new DocumentBuilder()
    .setTitle("TicketLive API")
    .setDescription("API documentation JWT")
    .setVersion("1.0.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
      "jwt-auth"
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api", app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
}

bootstrap();
