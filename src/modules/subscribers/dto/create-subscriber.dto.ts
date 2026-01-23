import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MaxLength } from "class-validator";

export class CreateSubscriberDto {
  @ApiProperty({ example: "laura@email.com" })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;
}
