import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  Max,
} from "class-validator";

export class CreateCommentDto {
  @ApiProperty({ example: "Juan Perez" })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: "Fan Verificado" })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  role?: string;

  @ApiProperty({ example: "Estuvo genial" })
  @IsString()
  @MaxLength(2000)
  content: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ example: "https://url-a-avatar.com/foto.jpg" })
  @IsOptional()
  @IsUrl({ require_tld: true })
  image?: string;

  // El front manda "data:image/jpeg;base64,...."
  @ApiPropertyOptional({ example: "data:image/jpeg;base64,/9j/4AAQSk..." })
  @IsOptional()
  @IsString()
  @MaxLength(12_000_000) // ~12MB de string (ajustable)
  eventImage?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  verified: boolean;

  @ApiPropertyOptional({ example: "Evento X" })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  event?: string;
}
