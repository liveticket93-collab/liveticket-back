import { BadRequestException, Injectable } from "@nestjs/common";
import { Coupon } from "./entities/coupon.entity";
import { CouponsRepository } from "./coupons.repository";
import { CreateCouponDto } from "./dtos/create_coupon.dto";

@Injectable()
export class CouponsService {
  constructor(private readonly couponsRepository: CouponsRepository) { }

  async createCoupon(dto: CreateCouponDto) {
    const code = this.couponsRepository.normalizeCode(dto.code);

    const existing = await this.couponsRepository.findByCode(code);
    if (existing) throw new BadRequestException("Ya existe un cupón con ese código");

    return this.couponsRepository.createCoupon({
      code,
      type: dto.type,
      value: dto.value,
      maxRedemptions: dto.maxRedemptions ?? 10,
      eventIds: dto.eventIds,
      categoryIds: dto.categoryIds,
    });
  }


  async getAllCoupons() {
    return this.couponsRepository.findAllCoupons();
  }

  async claimCoupon(codeRaw: string, userId: string, cartId: string) {
    const code = this.couponsRepository.normalizeCode(codeRaw);

    const coupon = await this.couponsRepository.findActiveByCode(code);
    if (!coupon) throw new BadRequestException("Cupón inválido o inactivo");

    const already = await this.couponsRepository.findUserActiveRedemption(coupon.id, userId);
    if (already) throw new BadRequestException("Ya usaste/activaste este cupón");

    const used = await this.couponsRepository.countUsedRedemptions(coupon.id);
    if (used >= coupon.maxRedemptions) {
      await this.couponsRepository.deactivateCoupon(coupon.id); // opcional
      throw new BadRequestException("Cupón agotado");
    }

    const redemption = await this.couponsRepository.createReservation(coupon.id, userId, cartId);
    return { coupon, redemption };
  }

  async confirmCoupon(cartId: string, userId: string) {
    const redemption = await this.couponsRepository.findReservedByCartAndUser(cartId, userId);
    if (!redemption) return { ok: true, message: "No coupon reserved for this cart" };

    await this.couponsRepository.confirmRedemption(redemption);
    return { ok: true };
  }

  calculateDiscount(total: number, coupon: Coupon) {
    if (total <= 0) return 0;

    if (coupon.type === "PERCENT") {
      const d = Math.floor((total * coupon.value) / 100);
      return Math.max(0, Math.min(d, total));
    }

    return Math.max(0, Math.min(coupon.value, total));
  }
}
