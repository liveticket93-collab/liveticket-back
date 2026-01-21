import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ChangePasswordDto {
  @ApiProperty({ example: "PasswordActual123!" })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({ example: "NuevaPassword123!" })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}
