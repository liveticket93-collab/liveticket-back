import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ResetPasswordDto {
  @ApiProperty({ example: "token_enviado_por_email" })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ example: "NuevaPassword123!" })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}
