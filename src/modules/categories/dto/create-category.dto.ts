import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CategoryBaseDto {
  @ApiProperty({
    description: "Nombre de la categoría",
    example: "Categoría 1",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  name: string;
}

export class CreateCategoryDto extends PickType(CategoryBaseDto, [
  "name",
] as const) {}
export class UpdateCategoryDto extends PickType(CategoryBaseDto, [
  "name",
] as const) {}
