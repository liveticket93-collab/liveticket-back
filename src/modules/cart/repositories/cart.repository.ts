import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart, CartStatus } from '../entities/cart.entity';



@Injectable()
export class CartRepository {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) { }

  async findActiveCartByUserId(userId: string): Promise<Cart | null> {
    return this.cartRepository.findOne({
      where: {
        user: { id: userId },
        status: CartStatus.ACTIVE,
      },
      relations: ['items', 'items.event'],
    });
  }

  async createCart(userId: string): Promise<Cart> {
    const cart = this.cartRepository.create({
      user: { id: userId } as any,
      status: CartStatus.ACTIVE,
      total: 0,
    });

    return this.cartRepository.save(cart);
  }

  findByIdWithItems(cartId: string): Promise<Cart | null> {
    return this.cartRepository.findOne({
      where: { id: cartId },
      relations: ['items', 'items.event'],
    });
  }

  async updateTotal(cartId: string, total: number): Promise<void> {
    await this.cartRepository.update(cartId, { total });
  }

}