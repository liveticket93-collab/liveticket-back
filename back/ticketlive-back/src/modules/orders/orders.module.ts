import { Module } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { OrderDetail } from "src/entities/orderDetails.entity";
import { User } from "../users/entities/users.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderDetail, Event, User])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
