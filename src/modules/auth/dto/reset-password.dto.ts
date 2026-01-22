import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsStrongPassword, Length, MinLength } from "class-validator";

export class ResetPasswordDto {
  @ApiProperty({ example: "token_enviado_por_email" })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ example: "NuevaPassword123!" })
  @IsNotEmpty()
  @IsString()
  @Length(8, 15)
  @IsStrongPassword({
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  newPassword: string;
}
