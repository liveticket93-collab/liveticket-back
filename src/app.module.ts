import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { typeOrmConfig } from "./config/typeorm";
import { mailerConfig } from "./config/nodemail";

import { UsersModule } from "./modules/users/users.module";
import { AuthModule } from "./modules/auth/auth.module";
import { EventModule } from "./modules/event/event.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { FileUploadModule } from "./modules/file-upload/file-upload.module";
import { CartModule } from "./modules/cart/cart.module";
import { PaymentModule } from "./modules/payment/payment.module";
import { EmailModule } from "./modules/email/email.module";
import { CouponsModule } from "./modules/coupons/coupons.module";
import { DatabaseModule } from "./database/seed.module";
import { CommentsModule } from "./modules/comments/comments.module";
import { SubscribersModule } from "./modules/subscribers/subscribers.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // ✅ Fuerza a leer tu .env local (y si existe .env.local, lo prioriza)
      envFilePath: [".env.local", ".env"],
      load: [typeOrmConfig, mailerConfig],
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get("typeorm_config")!,
    }),

    UsersModule,
    AuthModule,
    EventModule,
    OrdersModule,
    CategoriesModule,
    FileUploadModule,
    CartModule,
    PaymentModule,
    EmailModule,
    CouponsModule,
    CommentsModule,
    SubscribersModule,

    DatabaseModule, // si lo usas solo para seed, lo puedes comentar cuando no
  ],
})
export class AppModule {}
