// src/database/database.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "../modules/categories/entities/category.entity";
import { Event } from "../modules/event/entities/event.entity";
import { User } from "../modules/users/entities/users.entity";
import { Order } from "../modules/orders/entities/order.entity";
import { OrderDetail } from "../entities/orderDetails.entity";

import { EventSeed } from "./seeds/event.seed";
import { UserSeed } from "./seeds/user.seed";
import { OrderSeed } from "./seeds/order.seed";
import { OrderDetailSeed } from "./seeds/orderDetail.seed";
import { CategorySeed } from "./seeds/category.seed";

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Event, User, Order, OrderDetail]),
  ],
  providers: [CategorySeed, EventSeed, UserSeed, OrderSeed, OrderDetailSeed],
  exports: [CategorySeed, EventSeed, UserSeed, OrderSeed, OrderDetailSeed],
})
export class DatabaseModule {}
