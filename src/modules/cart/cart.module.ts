import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartRepository } from './repositories/cart.repository';
import { CartItemRepository } from './repositories/cart-item.repository';
import { EventModule } from '../event/event.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem]),
    EventModule,
  ],
  controllers: [CartController],
  providers: [CartService, CartRepository, CartItemRepository],
  exports: [CartService],
})
export class CartModule {}
