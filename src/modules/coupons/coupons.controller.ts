import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { CouponsService } from "./coupons.service";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { RolesGuard } from "src/roles/roles.guard";
import { ClaimCouponDto } from "./dtos/claim_coupon.dto";
import { ConfirmCouponDto } from "./dtos/confirm_coupon.dto";
import { CreateCouponDto } from "./dtos/create_coupon.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/roles/roles.decorator";
import { Role } from "src/roles/roles.enum";
import { UpdateCouponDto } from "./dtos/update_coupon.dto";

@ApiTags("Cupons")
@Controller("coupons")
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) { }

  @ApiOperation({
    summary:
      "Permite que un usuario autenticado reclame un cupón disponible usando un código.",
  })
  @UseGuards(JwtAuthGuard)
  @Post("claim")
  async claim(@Req() req, @Body() dto: ClaimCouponDto) {
    return this.couponsService.claimCoupon(dto.code, req.user.id, dto.cartId);
  }

  @ApiOperation({
    summary:
      "Permite que un usuario autenticado confirme el uso de un cupón previamente reclamado.",
  })
  @UseGuards(JwtAuthGuard)
  @Post("confirm")
  async confirm(@Req() req, @Body() dto: ConfirmCouponDto) {
    return this.couponsService.confirmCoupon(dto.cartId, req.user.id);
  }

  @ApiOperation({
    summary: "Permite que un administrador cree un nuevo cupón",
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @Post()
  async create(@Body() dto: CreateCouponDto) {
    return this.couponsService.createCoupon(dto);
  }

  @ApiOperation({
    summary:
      "Permite que un administrador obtenga la lista completa de cupones.",
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async getAll() {
    return this.couponsService.getAllCoupons();
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async update(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() updateCouponDto: UpdateCouponDto
  ): Promise<{ id: string }> {
    return this.couponsService.update(id, updateCouponDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async remove(
    @Param("id", new ParseUUIDPipe()) id: string
  ): Promise<{ id: string }> {
    return this.couponsService.remove(id);
  }
}
