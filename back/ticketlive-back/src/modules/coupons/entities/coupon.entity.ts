import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { CouponRedemption } from "./coupon-redemption.entity";
import { Category } from "src/modules/categories/entities/category.entity";
import { Event } from "src/modules/event/entities/event.entity";

export enum CouponType {
  PERCENT = "PERCENT",
  FIXED = "FIXED",
}

@Entity("coupons")
export class Coupon {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index({ unique: true })
  @Column()
  code: string; 

  @Column({ type: "enum", enum: CouponType })
  type: CouponType;

  @Column({ type: "int" })
  value: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: "int", default: 10 })
  maxRedemptions: number;

  @OneToMany(() => CouponRedemption, (r) => r.coupon)
  redemptions: CouponRedemption[];

  @ManyToMany(() => Event, (event) => event.coupons, { nullable: true })
  @JoinTable({ name: "coupon_events" })
  events?: Event[];

  @ManyToMany(() => Category, (category) => category.coupons, { nullable: true })
  @JoinTable({ name: "coupon_categories" })
  categories?: Category[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
