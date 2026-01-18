import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CartItem } from "../entities/cart-item.entity";
import { Repository } from "typeorm";

@Injectable()
export class CartItemRepository {
    constructor(
        @InjectRepository(CartItem)
        private readonly repository: Repository<CartItem>,
    ) { }

    findByCartId(cartId: string): Promise<CartItem[]> {
        return this.repository.find({
            where: {
                cart: { id: cartId },
            },
            relations: ['event'],
        });
    }

    findByCartAndEvent(
        cartId: string,
        eventId: string,
    ): Promise<CartItem | null> {
        return this.repository.findOne({
            where: {
                cart: { id: cartId },
                event: { id: eventId },
            },
            relations: ['cart', 'event'],
        });
    }

    findById(id: string): Promise<CartItem | null> {
        return this.repository.findOne({
            where: { id },
            relations: ['cart', 'event'],
        });
    }


    create(data: Partial<CartItem>): CartItem {
        return this.repository.create(data);
    }

    save(cartItem: CartItem): Promise<CartItem> {
        return this.repository.save(cartItem);
    }

    remove(cartItem: CartItem): Promise<CartItem> {
        return this.repository.remove(cartItem);
    }
}
