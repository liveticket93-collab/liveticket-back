import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";
import { CreateUserDto, LoginUserDto } from "../users/dto/users.dto";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "./guard/jwt-auth.guard";
import type { Response } from "express";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService
  ) {}

  //Login register formulario
  @ApiOperation({
    summary: "Permite el loggin de un usuario mediante email y password",
  })
  @Post("/signin")
  async signIn(
    @Body() credential: LoginUserDto,
    @Res({ passthrough: true }) res
  ) {
    const user = await this.authService.signIn(
      credential.email,
      credential.password
    );
    const token = await this.authService.generateToken(user);

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return { message: "Usuario loggeado exitosamente", 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        phone: user.phone,
        address: user.address,
        profile_photo: user.profile_photo,
        dni: user.dni,
        birthday: user.birthday,
      }
     };
  }

  @ApiOperation({
    summary: "Permite cerrar sesión de un usuario loggeado",
  })
  @ApiBearerAuth("jwt-auth")
  @UseGuards(JwtAuthGuard) // Solo usuarios logueados
  @Post("/signout")
  signOut(@Res({ passthrough: true }) res: Response) {
    // Eliminamos la cookie
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: false, // si usas HTTPS pon true
      sameSite: "lax",
    });

    return { message: "Sesión cerrada exitosamente" };
  }

  @ApiOperation({
    summary: "Permite registrar un usuario mediante formulario",
  })
  @Post("/signup")
  async signUp(@Body() user: CreateUserDto, @Res({ passthrough: true }) res) {
    const newUser = await this.authService.signUp(user);
    const token = await this.authService.generateToken(newUser);
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return { message: "Usuario creado exitosamente", user: newUser };
  }

  //Login Register con google
  @ApiOperation({
    summary:
      "Permite registrar un usuario si no consta en la base de datos o loggearlo si ya consta, utilizando google auth",
  })
  @Get("google")
  @UseGuards(AuthGuard("google"))
  googleLogin() {}

  @ApiOperation({
    summary: "Callback llamado por /google",
  })
  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleAuthCallback(@Req() req, @Res({ passthrough: true }) res) {
    const user = await this.authService.validateGoogleUser(req.user);
    const token = await this.authService.generateToken(user);

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.redirect(
      `${this.config.get<string>("FRONT_URL")}${this.config.get<string>(
        "FRONT_CALLBACK"
      )}`
    );
  }

  
}
