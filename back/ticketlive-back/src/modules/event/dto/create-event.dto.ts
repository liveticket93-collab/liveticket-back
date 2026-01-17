import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  IsPositive,
  IsBoolean,
  IsUUID,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  date: string;

  @IsDateString()
  start_time: string;

  @IsDateString()
  end_time: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsNumber()
  @IsPositive()
  capacity: number;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsBoolean()
  status: boolean;

  @IsUUID()
  categoryId: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;
}
