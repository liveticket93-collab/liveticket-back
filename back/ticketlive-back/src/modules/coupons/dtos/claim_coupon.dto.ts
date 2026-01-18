import { IsNotEmpty, IsString } from "class-validator";

export class ClaimCouponDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  cartId: string;
}

