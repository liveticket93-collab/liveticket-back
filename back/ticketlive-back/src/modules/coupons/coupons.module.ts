import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CouponsController } from "./coupons.controller";
import { CouponsService } from "./coupons.service";
import { CouponsRepository } from "./coupons.repository";
import { Coupon } from "./entities/coupon.entity";
import { CouponRedemption } from "./entities/coupon-redemption.entity";
import { Event } from "../event/entities/event.entity";
import { Category } from "../categories/entities/category.entity";

@Module({
  imports: [TypeOrmModule.forFeature(
    [
      Coupon, 
      CouponRedemption,
      Event,
      Category
    ]
  )],
  controllers: [CouponsController],
  providers: [CouponsService, CouponsRepository],
  exports: [CouponsService],
})
export class CouponsModule {}
