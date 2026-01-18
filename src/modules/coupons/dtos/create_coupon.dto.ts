import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from "class-validator";
import { CouponType } from "../entities/coupon.entity";

export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  @IsEnum(CouponType)
  type: CouponType;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  value: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxRedemptions?: number;

  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  eventIds?: string[];
  
  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  categoryIds?: string[];
}

