import {
  IsString,
  IsUUID,
  IsDateString,
  IsInt,
  IsNumber,
  IsPositive,
  IsUrl,
  IsOptional,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  date: string;

  @IsString()
  start_time: string;

  @IsString()
  end_time: string;

  @IsString()
  location: string;

  @IsInt()
  @IsPositive()
  capacity: number;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsUrl()
  imageURL: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsUUID()
  category_id: string;
}
