import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Req,
  UseGuards,
} from "@nestjs/common";
import { CartService } from "./cart.service";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { AddCartItemDto } from "./dto/add-cart-item.dto";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("Cart")
@Controller("cart")
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({
    summary: "Permite obtener el carrito del usuario",
  })
  @Get()
  async getMyCart(@Req() req) {
    const user = req.user;
    return this.cartService.getOrCreateActiveCart(user);
  }

  @ApiOperation({
    summary: "Permite agregar un item al carrito de un usuario",
  })
  @Post("items")
  async addItemToCart(@Req() req, @Body() addCartItemDto: AddCartItemDto) {
    const user = req.user;

    return this.cartService.addItemToCart(
      user,
      addCartItemDto.eventId,
      addCartItemDto.quantity
    );
  }

  @ApiOperation({
    summary: "Permite eliminar un item del carrito del usuario",
  })
  @ApiParam({
    name: "cartItemId",
    description: "ID del item del carrito a eliminar",
  })
  @Delete("items/:cartItemId")
  async removeItemFromCart(
    @Req() req,
    @Param("cartItemId") cartItemId: string
  ) {
    const user = req.user;
    return this.cartService.removeItemFromCart(user, cartItemId);
  }

  @ApiOperation({
    summary: "Permite vaciar el carrito",
  })
  @Delete()
  async clearCart(@Req() req) {
    const user = req.user;
    return this.cartService.clearCart(user);
  }
}
