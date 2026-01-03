import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { seeds } from "./seeds";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  for (const Seed of seeds) {
    const seed = app.get(Seed);
    await seed.run();
  }

  await app.close();
}

bootstrap();
