import { Cart } from "src/modules/cart/entities/cart.entity";
import { Order } from "src/modules/orders/entities/order.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true, nullable: true, default: null })
  googleId?: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ type: "varchar", length: "60", nullable: true })
  password?: string;

  @Column({ type: "varchar", length: "50", nullable: false })
  name: string;

  @Column({ type: "date", nullable: true })
  birthday?: Date;

  @Column({ type: "varchar", nullable: true })
  dni?: string;

  @Column({ type: "varchar", nullable: true, length: 20 })
  phone?: string;

  @Column({ type: "varchar", nullable: true })
  profile_photo?: string | null;

  @Column({ nullable: true })
  profile_photo_id?: string;

  @Column({ type: "varchar", nullable: true })
  address?: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: "timestamptz", nullable: true })
  bannedAt?: Date | null;

  @Column({ type: "text", nullable: true })
  banReason?: string | null;

  @Column({ type: "varchar", nullable: true })
  resetPasswordTokenHash: string | null;

  @Column({ type: "timestamptz", nullable: true })
  resetPasswordExpiresAt: Date | null;

  @CreateDateColumn({ type: "date", name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ type: "date", name: "updated_at" })
  updatedAt: Date;

  //Users 1:N Orders
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];
}
