import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

//import { AppController } from './app.controller';
//import { AppService } from './app.service';

import { UsersModule } from "./modules/users/users.module";
import { AuthModule } from "./modules/auth/auth.module";
import { EventModule } from "./modules/event/event.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { CategoriesModule } from "./modules/categories/categories.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        host: config.get("DB_HOST"),
        port: Number(config.get("DB_PORT")),
        username: config.get("DB_USERNAME"),
        password: config.get("DB_PASSWORD"),
        database: config.get("DB_NAME"),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    UsersModule,
    AuthModule,
    EventModule,
    OrdersModule,
    CategoriesModule,
    // EventModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
