import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CartPaymentService } from './payments.service';
import { PaymentController } from './payment.controller';
import { CartModule } from '../cart/cart.module';


@Module({
  imports: [ConfigModule, forwardRef(() => CartModule)],
  providers: [CartPaymentService],
  exports: [CartPaymentService], 
  controllers: [PaymentController],
})
export class PaymentModule {}
