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
import type { Response, Request } from "express";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService
  ) {}

  private getCookieOptions() {
    const isProd = process.env.NODE_ENV === "production";

    return {
      httpOnly: true,
      secure: isProd,                    
      sameSite: isProd ? "none" : "lax",  
      maxAge: 24 * 60 * 60 * 1000,
    } as const;
  }

  @ApiOperation({
    summary: "Permite el loggin de un usuario mediante email y password",
  })
  @Post("/signin")
  async signIn(
    @Body() credential: LoginUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const user = await this.authService.signIn(
      credential.email,
      credential.password
    );
    const token = await this.authService.generateToken(user);

    res.cookie("access_token", token, this.getCookieOptions());

    return {
      message: "Usuario loggeado exitosamente",
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
      },
    };
  }

  @ApiOperation({
    summary: "Permite cerrar sesión de un usuario loggeado",
  })
  @ApiBearerAuth("jwt-auth")
  @UseGuards(JwtAuthGuard)
  @Post("/signout")
  signOut(@Res({ passthrough: true }) res: Response) {
    const isProd = process.env.NODE_ENV === "production";

    res.clearCookie("access_token", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
    });

    return { message: "Sesión cerrada exitosamente" };
  }

  @ApiOperation({
    summary: "Permite registrar un usuario mediante formulario",
  })
  @Post("/signup")
  async signUp(
    @Body() user: CreateUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const newUser = await this.authService.signUp(user);
    const token = await this.authService.generateToken(newUser);

    res.cookie("access_token", token, this.getCookieOptions());

    return { message: "Usuario creado exitosamente", user: newUser };
  }

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
  async googleAuthCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const user = await this.authService.validateGoogleUser((req as any).user);
    const token = await this.authService.generateToken(user);

    res.cookie("access_token", token, this.getCookieOptions());

    const frontendUrl =
      this.config.get<string>("FRONTEND_URL") || process.env.FRONT_URL || "http://localhost:3005";

    return res.redirect(frontendUrl);
  }

  @Post("forgot-password")
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.requestPasswordReset(dto.email);

    return {
      message:
        "Si el correo existe, te enviaremos instrucciones para restablecer tu contraseña.",
    };
  }

  @Post("reset-password")
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto.token, dto.newPassword);

    return { message: "Contraseña actualizada correctamente." };
  }

  @Post("change-password")
  @UseGuards(JwtAuthGuard)
  async changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    await this.authService.changePassword(
      req.user,
      dto.currentPassword,
      dto.newPassword
    );

    return { message: "Contraseña cambiada correctamente." };
  }
}


