import { OrderDetail } from "src/entities/orderDetails.entity";
import { User } from "src/modules/users/entities/users.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "orders" })
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  total: number;

  @Column()
  date: Date;

  @Column()
  status: string;

  //Users 1:N Orders
  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  //Order 1:1 OrderDetail
  @OneToOne(() => OrderDetail, (detail) => detail.order)
  @JoinColumn({ name: "order_detail" })
  order_detail: OrderDetail;
}
