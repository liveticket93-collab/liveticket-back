import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min, IsUUID } from "class-validator";

export class AddCartItemDto {
  @ApiProperty({
    description: "UUID de la categoría",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @IsUUID()
  eventId: string;

  @ApiProperty({
    description: "Cantidad de entradas",
    example: 5,
  })
  @IsInt()
  @Min(1)
  quantity: number;
}
