  import { registerAs } from "@nestjs/config";
  import { TypeOrmModuleOptions } from "@nestjs/typeorm";
  import { DataSource } from "typeorm";

  export const typeOrmConfig = registerAs(
    "typeorm_config",
    (): TypeOrmModuleOptions => {
      const dbUrl = process.env.DATABASE_URL ?? "";

      const isLocalDb =
        dbUrl.includes("localhost") ||
        dbUrl.includes("127.0.0.1") ||
        process.env.DB_HOST === "localhost" ||
        process.env.DB_HOST === "127.0.0.1";

      const useUrl = !!process.env.DATABASE_URL && !isLocalDb;
      const useSSL = useUrl;

      return {
        type: "postgres",
        ...(useUrl
          ? {
            url: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
            extra: { ssl: { rejectUnauthorized: false } },
          }
          : {
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: String(process.env.DB_PASSWORD ?? ""), // 👈 CLAVE
            database: process.env.DB_NAME,
            ssl: false,
          }),
        autoLoadEntities: true,
        synchronize: process.env.TYPEORM_SYNC === "true",
      };
    }
  );

  export const connectionSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: String(process.env.DB_PASSWORD ?? ""),
    database: process.env.DB_NAME,
    ssl: false,
    entities: ["dist/**/*.entity{.js,.ts}"],
    synchronize: true,
  });
