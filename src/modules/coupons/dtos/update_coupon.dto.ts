import { PartialType } from '@nestjs/mapped-types';
import { CreateCouponDto } from './create_coupon.dto';

export class UpdateCouponDto extends PartialType(CreateCouponDto) {}
