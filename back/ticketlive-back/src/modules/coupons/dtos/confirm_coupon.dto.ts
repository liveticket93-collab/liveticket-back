import { IsNotEmpty, IsString } from "class-validator";

export class ConfirmCouponDto {
  @IsString()
  @IsNotEmpty()
  cartId: string;
}

