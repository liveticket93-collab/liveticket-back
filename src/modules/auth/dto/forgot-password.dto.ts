import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ForgotPasswordDto {
  @ApiProperty({ example: "user@email.com" })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
