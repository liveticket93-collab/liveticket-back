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
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Cart")
@Controller("cart")
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getMyCart(@Req() req) {
    const user = req.user;
    return this.cartService.getOrCreateActiveCart(user);
  }

  @Post("items")
  async addItemToCart(@Req() req, @Body() addCartItemDto: AddCartItemDto) {
    const user = req.user;

    return this.cartService.addItemToCart(
      user,
      addCartItemDto.eventId,
      addCartItemDto.quantity
    );
  }

  @Delete("items/:cartItemId")
  async removeItemFromCart(
    @Req() req,
    @Param("cartItemId") cartItemId: string
  ) {
    const user = req.user;
    return this.cartService.removeItemFromCart(user, cartItemId);
  }

  @Delete()
  async clearCart(@Req() req) {
    const user = req.user;
    return this.cartService.clearCart(user);
  }
}
