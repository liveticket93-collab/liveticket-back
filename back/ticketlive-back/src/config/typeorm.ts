import { registerAs } from "@nestjs/config";
import { config as dotenvConfig } from "dotenv";
import { DataSource, DataSourceOptions } from "typeorm";

dotenvConfig({ path: ".env" }); // Ruta correcta a tu archivo .env

const config = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ["dist/**/*.entity{.ts,.js}"],
  autoLoadEntities: true,
  synchronize: false,
};

// Exportar para NestJS ConfigModule
export const typeOrmConfig = registerAs("typeorm_config", () => config);

// Para migraciones con TypeORM
export const connectionSource = new DataSource(config as DataSourceOptions);
