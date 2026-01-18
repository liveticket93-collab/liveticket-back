import { OrderDetail } from "src/entities/orderDetails.entity";
import { CartItem } from "src/modules/cart/entities/cart-item.entity";
import { Category } from "src/modules/categories/entities/category.entity";
import { Coupon } from "src/modules/coupons/entities/coupon.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "events" })
export class Event {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: 'date' })
  date: string;
  // Fecha del evento (puede ser solo día o fecha completa)

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

  @Column({ type: "double precision", nullable: true })
  latitude: number | null;

  @Column({ type: "double precision", nullable: true })
  longitude: number | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  imageUrl: string;

  @Column()
  status: boolean;

  //Event N:1 Category
  @ManyToOne(() => Category, (category) => category.events, { nullable: false })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ type: 'uuid' })
  categoryId: string;

  //Event 1:N Order_detail
  @OneToMany(() => OrderDetail, (detail) => detail.event)
  order_details: OrderDetail[];

  @ManyToMany(() => Coupon, (coupon) => coupon.events)
  coupons?: Coupon[];

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;

  @OneToMany(() => CartItem, item => item.event)
  cartItems: CartItem[];
}
