import {
  BadRequestException,
  Controller,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { CartService } from "../cart/cart.service";
import { CartPaymentService } from "./payments.service";
import { CouponsService } from "../coupons/coupons.service";

@ApiTags("Payment")
@Controller("payment")
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(
    private readonly cartService: CartService,
    private readonly cartPaymentService: CartPaymentService,
    private readonly couponsService: CouponsService
  ) {}

  @ApiOperation({
    summary: "Genera una URL de pago para el carrito activo",
    description:
      "Crea una preferencia de pago en Mercado Pago con los productos del carrito del usuario autenticado y devuelve la URL de checkout.",
  })
  @Post("checkout")
  async checkout(@Req() req: any) {
    const user = req.user as { id: string; email: string; isAdmin: boolean };

    if (!user?.id) {
      throw new BadRequestException("Usuario inválido en la sesión");
    }

    const cart = await this.cartService.getOrCreateActiveCart(user as any);

    const cartWithItems =
      cart.items ? cart : await this.cartService.getCartByIdWithItems(cart.id);

    if (!cartWithItems?.items || cartWithItems.items.length === 0) {
      throw new BadRequestException("El carrito está vacío");
    }

    const redemption = await this.couponsService.getCouponForCart(
      cartWithItems.id,
      user.id
    );
    const coupon = redemption?.coupon ?? null;

    const checkoutUrl = await this.cartPaymentService.createPreference(
      cartWithItems,
      coupon
    );

    if (!checkoutUrl) {
      throw new BadRequestException("No se pudo generar la URL de Mercado Pago");
    }

    return { url: checkoutUrl };
  }
}
