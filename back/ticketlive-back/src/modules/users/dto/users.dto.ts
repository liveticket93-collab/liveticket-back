import { ApiProperty, OmitType, PartialType, PickType } from "@nestjs/swagger";
import {
  IsOptional,
  IsString,
  IsDateString,
  IsNotEmpty,
  IsEmail,
  Length,
  IsStrongPassword,
  Validate,
  IsUrl,
} from "class-validator";
import { MatchPassword } from "src/decorators/matchPassword.decorator";

export class UserBaseDto {
  @ApiProperty({
    description: "Nombre de usuario",
    example: "User01",
  })
  @IsNotEmpty()
  @Length(1, 50)
  @IsString()
  name: string;

  @ApiProperty({
    description: "Debe ser un email válido",
    example: "user01@mail.com",
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      "La contraseña debe contener al menos una minúscula, una mayúscula, un número y uno de los siguientes caracteres especiales: !@#$%^&*",
    example: "Abcd1234*",
  })
  @IsNotEmpty()
  @IsString()
  @Length(8, 15)
  @IsStrongPassword({
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;

  @ApiProperty({
    description:
      "La contraseña debe contener al menos una minúscula, una mayúscula, un número y uno de los siguientes caracteres especiales: !@#$%^&*",
    example: "Abcd1234*",
  })
  @IsNotEmpty()
  @Validate(MatchPassword, ["password"])
  confirmPassword: string;

  @ApiProperty({
    description: "Debe ser un número telefónico con su codigo de area",
    example: "593987654321",
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    description: "Dirección",
    example: "Avenida siempre viva y Calle Falsa 123",
  })
  @IsOptional()
  @IsString()
  @Length(3, 80)
  address?: string;

  @ApiProperty({
    description: "Dirección",
    example: "Avenida siempre viva y Calle Falsa 123",
  })
  @IsOptional()
  @IsString()
  @Length(8, 20)
  dni?: string;

  @ApiProperty({
    description: "Debe ser una imagen de máximo 1MB",
    example:
      "https://res.cloudinary.com/dhm9f8fre/image/upload/v1766970191/profile-img_lghlfe.png",
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  profile_photo?: string;

  @ApiProperty({
    description: "Fecha de nacimiento",
    example: "01/01/2000",
  })
  @IsOptional()
  @IsDateString()
  birthday?: Date;
}

export class CreateUserDto extends PickType(UserBaseDto, [
  "email",
  "name",
  "password",
  "confirmPassword",
  "address",
  "phone",
] as const) { }

export class LoginUserDto extends PickType(UserBaseDto, [
  "email",
  "password",
] as const) { }

export class UpdateUserDto extends PartialType(
  OmitType(UserBaseDto, ["password", "confirmPassword"] as const),
) {

  @IsOptional()
  @IsString()
  profile_photo_id?: string;
}
