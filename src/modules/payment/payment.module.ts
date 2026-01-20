import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CartPaymentService } from './payments.service';
import { PaymentController } from './payment.controller';
import { CartModule } from '../cart/cart.module';
import { CouponsModule } from '../coupons/coupons.module';


@Module({
  imports: [ConfigModule, forwardRef(() => CartModule), forwardRef(() => CouponsModule)],
  providers: [CartPaymentService],
  exports: [CartPaymentService], 
  controllers: [PaymentController],
})
export class PaymentModule {}
