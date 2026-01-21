import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Coupon, CouponType } from "./entities/coupon.entity";
import { CouponRedemption, RedemptionStatus } from "./entities/coupon-redemption.entity";
import { Category } from "../categories/entities/category.entity";
import { Event } from "../event/entities/event.entity";
import { UpdateCouponDto } from "./dtos/update_coupon.dto";

@Injectable()
export class CouponsRepository {
  constructor(
    @InjectRepository(Coupon) private readonly couponRepo: Repository<Coupon>,
    @InjectRepository(CouponRedemption) private readonly redemptionRepo: Repository<CouponRedemption>,
    @InjectRepository(Event) private readonly eventRepo: Repository<Event>,
    @InjectRepository(Category) private readonly categoryRepo: Repository<Category>,
  ) { }

  normalizeCode(code: string) {
    return (code ?? "").trim().toUpperCase();
  }

  async createCoupon(data: {
    code: string;
    type: CouponType;
    value: number;
    maxRedemptions?: number;
    eventIds?: string[];
    categoryIds?: string[];
  }) {
    const coupon = this.couponRepo.create({
      code: this.normalizeCode(data.code),
      type: data.type,
      value: data.value,
      maxRedemptions: data.maxRedemptions ?? 10,
      isActive: true,
    });

    if (data.eventIds?.length) {
      const events = await this.eventRepo.find({ where: { id: In(data.eventIds) } });

      if (events.length !== data.eventIds.length) {
        throw new BadRequestException("Uno o más eventIds no existen");
      }

      coupon.events = events;
    }

    if (data.categoryIds?.length) {
      const categories = await this.categoryRepo.find({ where: { id: In(data.categoryIds) } });

      if (categories.length !== data.categoryIds.length) {
        throw new BadRequestException("Uno o más categoryIds no existen");
      }

      coupon.categories = categories;
    }

    return this.couponRepo.save(coupon);
  }

  findActiveByCode(code: string) {
    return this.couponRepo.findOne({
      where: { code, isActive: true },
      relations: { events: true, categories: true },
    });
  }

  findByCode(code: string) {
    return this.couponRepo.findOne({ where: { code } });
  }

  async findAllCoupons() {
    return this.couponRepo.find({
      order: { createdAt: "DESC" },
      relations: { events: true, categories: true },
    });
  }

  findUserActiveRedemption(couponId: string, userId: string) {
    return this.redemptionRepo.findOne({
      where: {
        coupon: { id: couponId },
        userId,
        status: In([RedemptionStatus.RESERVED, RedemptionStatus.APPLIED]),
      },
    });
  }

  countUsedRedemptions(couponId: string) {
    return this.redemptionRepo.count({
      where: {
        coupon: { id: couponId },
        status: In([RedemptionStatus.RESERVED, RedemptionStatus.APPLIED]),
      },
    });
  }

  createReservation(couponId: string, userId: string, cartId: string) {
    const redemption = this.redemptionRepo.create({
      coupon: { id: couponId } as any,
      userId,
      cartId,
      status: RedemptionStatus.RESERVED,
    });
    return this.redemptionRepo.save(redemption);
  }

  findReservedByCartAndUser(cartId: string, userId: string) {
    return this.redemptionRepo.findOne({
      where: { cartId, userId, status: RedemptionStatus.RESERVED },
    });
  }

  findReservedOrAppliedByCartAndUser(cartId: string, userId: string) {
    return this.redemptionRepo.findOne({
      where: {
        cartId,
        userId,
        status: In([RedemptionStatus.RESERVED, RedemptionStatus.APPLIED]),
      },
      relations: { coupon: true },
    });
  }

  confirmRedemption(redemption: CouponRedemption) {
    redemption.status = RedemptionStatus.APPLIED;
    return this.redemptionRepo.save(redemption);
  }

  deactivateCoupon(couponId: string) {
    return this.couponRepo.update(couponId, { isActive: false });
  }

  async updateCoupon(
    id: string,
    updateCoupon: UpdateCouponDto
  ): Promise<{ id: string } | null> {
    const result = await this.couponRepo.update(id, updateCoupon);
    if (result.affected === 0) {
      return null;
    }

    return { id };
  }

  async deleteCoupon(id: string): Promise<{ id: string } | null> {
    const result = await this.couponRepo.delete(id);

    if (result.affected === 0) {
      return null;
    }

    return { id };
  }
}

