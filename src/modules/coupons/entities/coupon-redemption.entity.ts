import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index } from "typeorm";
import { Coupon } from "./coupon.entity";

export enum RedemptionStatus {
  RESERVED = "RESERVED",
  APPLIED = "APPLIED",
  CANCELED = "CANCELED",
}

@Entity("coupon_redemptions")
export class CouponRedemption {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Coupon, (c) => c.redemptions, { eager: true })
  coupon: Coupon;

  @Index()
  @Column()
  userId: string;

  @Index()
  @Column()
  cartId: string;

  @Column({ type: "enum", enum: RedemptionStatus, default: RedemptionStatus.RESERVED })
  status: RedemptionStatus;

  @CreateDateColumn()
  createdAt: Date;
}
