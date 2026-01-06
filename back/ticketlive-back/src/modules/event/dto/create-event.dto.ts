import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  IsPositive,
  IsBoolean,
  IsUUID,
  IsOptional,
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
}
