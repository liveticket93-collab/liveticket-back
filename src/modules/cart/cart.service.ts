import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Cart } from "./entities/cart.entity";
import { User } from "../users/entities/users.entity";
import { EventRepository } from "../event/event.repository";
import { CartRepository } from "./repositories/cart.repository";
import { CartItemRepository } from "./repositories/cart-item.repository";

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly cartItemRepository: CartItemRepository,
    private readonly eventRepository: EventRepository
  ) { }

  async getOrCreateActiveCart(user: User): Promise<Cart> {
    let cart = await this.cartRepository.findActiveCartByUserId(user.id);

    if (!cart) {
      cart = await this.cartRepository.createCart(user.id);
    }

    return cart;
  }

  async getCartByUser(userId: string): Promise<Cart | null> {
    return this.cartRepository.findActiveCartByUserId(userId);
  }

  async addItemToCart(
    user: User,
    eventId: string,
    quantity: number
  ): Promise<Cart> {
    if (quantity <= 0) {
      throw new BadRequestException("Cantidad inválida");
    }

    const cart = await this.getOrCreateActiveCart(user);

    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new NotFoundException("Evento no encontrado");
    }

    const existingItem = await this.cartItemRepository.findByCartAndEvent(
      cart.id,
      event.id
    );

    if (existingItem) {
      existingItem.quantity += quantity;

      const unit = Number(existingItem.unitPrice) || 0;
      existingItem.subtotal = unit * existingItem.quantity;

      await this.cartItemRepository.save(existingItem);
    } else {
      const price = Number((event as any).price) || 0;

      const newItem = this.cartItemRepository.create({
        cart,
        event,
        quantity,
        unitPrice: price,
        subtotal: quantity * price,
      });

      await this.cartItemRepository.save(newItem);
    }

    await this.recalculateCartTotal(cart.id);

    const updatedCart = await this.cartRepository.findByIdWithItems(cart.id);

    if (!updatedCart) {
      throw new InternalServerErrorException(
        "No se pudo recuperar el carrito actualizado"
      );
    }

    return updatedCart;
  }

  async removeItemFromCart(user: User, cartItemId: string): Promise<Cart> {
    const cart = await this.getOrCreateActiveCart(user);

    const item = await this.cartItemRepository.findById(cartItemId);
    if (!item || item.cart.id !== cart.id) {
      throw new NotFoundException("Item no encontrado en el carrito");
    }

    await this.cartItemRepository.remove(item);
    await this.recalculateCartTotal(cart.id);

    const updatedCart = await this.cartRepository.findByIdWithItems(cart.id);

    if (!updatedCart) {
      throw new InternalServerErrorException(
        "No se pudo recuperar el carrito actualizado"
      );
    }

    return updatedCart;
  }

  async clearCart(user: User): Promise<Cart> {
    const cart = await this.getOrCreateActiveCart(user);

    const items = await this.cartItemRepository.findByCartId(cart.id);
    for (const item of items) {
      await this.cartItemRepository.remove(item);
    }

    await this.recalculateCartTotal(cart.id);

    const updatedCart = await this.cartRepository.findByIdWithItems(cart.id);

    if (!updatedCart) {
      throw new InternalServerErrorException(
        "No se pudo recuperar el carrito limpio"
      );
    }

    return updatedCart;
  }

  private async recalculateCartTotal(cartId: string): Promise<void> {
    const items = await this.cartItemRepository.findByCartId(cartId);

    const totalNumber = items.reduce((sum, item) => {
      const subtotal = Number(item.subtotal) || 0;
      return sum + subtotal;
    }, 0);

    const total = Math.round(totalNumber * 100) / 100;

    await this.cartRepository.updateTotal(cartId, total);
  }

  async getCartByIdWithItems(cartId: string): Promise<Cart | null> {
    return this.cartRepository.findByIdWithItems(cartId);
  }
}

