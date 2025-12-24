import { OrderDetail } from "src/entities/orderDetails.entity";
import { Category } from "src/modules/categories/entities/category.entity";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "events" })
export class Event {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  date: Date; // Fecha del evento (puede ser solo día o fecha completa)

  @Column({ type: "timestamp" })
  start_time: Date; // Hora de inicio del evento

  @Column({ type: "timestamp" })
  end_time: Date; // Hora de fin del evento

  @Column()
  location: string;

  @Column()
  capacity: number;

  @Column()
  price: number;

  @Column({ type: "varchar", length: 255 })
  imageUrl: string;

  @Column()
  status: boolean;

  //Event N:1 Category
  @ManyToOne(() => Category, (category) => category.envents)
  category: Category;

  //Event 1:N Order_detail
  @OneToMany(() => OrderDetail, (detail) => detail.event)
  order_details: OrderDetail[];
}
