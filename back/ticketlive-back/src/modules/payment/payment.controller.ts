import { Controller, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { CartService } from "../cart/cart.service";
import { CartPaymentService } from "./payments.service";
import { BadRequestException } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Payment")
@Controller("payment")
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(
    private readonly cartService: CartService,
    private readonly cartPaymentService: CartPaymentService
  ) {}

  @Post("checkout")
  async checkout(@Req() req) {
    const user = req.user;

    const cart = await this.cartService.getOrCreateActiveCart(user);

    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException("El carrito está vacío");
    }

    const checkoutUrl = await this.cartPaymentService.createPreference(cart);

    if (!checkoutUrl) {
      throw new Error("No se pudo generar la URL de Mercado Pago");
    }

    return { url: checkoutUrl };
  }
}
