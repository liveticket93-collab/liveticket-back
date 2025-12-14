import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  dni?: string;

  @IsOptional()
  @IsDateString()
  birthday?: Date;
}
