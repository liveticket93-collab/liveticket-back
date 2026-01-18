import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmConfig } from "./config/typeorm";
import { UsersModule } from "./modules/users/users.module";
import { AuthModule } from "./modules/auth/auth.module";
import { EventModule } from "./modules/event/event.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { FileUploadModule } from "./modules/file-upload/file-upload.module";
import { DatabaseModule } from "./database/seed.module";
import { CartModule } from "./modules/cart/cart.module";
import { PaymentModule } from "./modules/payment/payment.module";
import { EmailModule } from "./modules/email/email.module";
import { mailerConfig } from "./config/nodemail";
import { CouponsModule } from "./modules/coupons/coupons.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig, mailerConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get("typeorm_config")!, // <- coincide con registerAs
    }),
    UsersModule,
    AuthModule,
    EventModule,
    OrdersModule,
    CategoriesModule,
    FileUploadModule,
    CartModule,
    PaymentModule,
    DatabaseModule,
    EmailModule, // 👈 Solo al hacer el npm run seed caso contrario comentar
    CouponsModule,
  ],
})
export class AppModule {}
