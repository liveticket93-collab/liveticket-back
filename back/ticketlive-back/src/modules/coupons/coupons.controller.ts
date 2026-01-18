import { Body, Controller, Get, Post, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { CouponsService } from "./coupons.service";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { RolesGuard } from "src/roles/roles.guard";
import { ClaimCouponDto } from "./dtos/claim_coupon.dto";
import { ConfirmCouponDto } from "./dtos/confirm_coupon.dto";
import { CreateCouponDto } from "./dtos/create_coupon.dto";

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) { }

  @UseGuards(JwtAuthGuard)
  @Post('claim')
  async claim(
    @Req() req,
    @Body() dto: ClaimCouponDto,
  ) {
    return this.couponsService.claimCoupon(
      dto.code,
      req.user.id,
      dto.cartId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('confirm')
  async confirm(
    @Req() req,
    @Body() dto: ConfirmCouponDto,
  ) {
    return this.couponsService.confirmCoupon(
      dto.cartId,
      req.user.id,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @Post()
  async create(@Body() dto: CreateCouponDto) {
    return this.couponsService.createCoupon(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async getAll() {
    return this.couponsService.getAllCoupons();
  }
}
