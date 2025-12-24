import { Event } from "src/modules/event/entities/event.entity";
import { Order } from "src/modules/orders/entities/order.entity";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "order_detail" })
export class OrderDetail {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  quantity: number;

  @Column()
  unit_price: number;

  //Event 1:N Order_detail
  @ManyToOne(() => Event, (event) => event.order_details)
  event: Event;

  //Order 1:1 OrderDetail
  @OneToOne(() => Order, (order) => order.order_detail)
  order: Order;
}
