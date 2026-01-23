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

  private isProdEnv() {
    return process.env.NODE_ENV === "production" || !!process.env.RENDER;
  }

  private getCookieOptions() {
    const isProd = this.isProdEnv();

    return {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/", 
    } as const;
  }

  private getClearCookieOptions() {
    const isProd = this.isProdEnv();

    return {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
    } as const;
  }

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

    const frontendUrl =
      this.config.get<string>("FRONTEND_URL") ||
      process.env.FRONT_URL ||
      "http://localhost:3005";

    return res.redirect(frontendUrl);
  }

  @Post("/signin/api")
  async signInApi(
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
      message: "Login OK",
      token, 
      user,
    };
  }

  @ApiOperation({
    summary: "Permite cerrar sesión (web) y redireccionar al frontend",
  })
  @ApiBearerAuth("jwt-auth")
  @UseGuards(JwtAuthGuard)
  @Post("/signout")
  signOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("access_token", this.getClearCookieOptions());

    const frontendUrl =
      this.config.get<string>("FRONTEND_URL") ||
      process.env.FRONT_URL ||
      "http://localhost:3005";

    return res.redirect(frontendUrl);
  }

  @ApiOperation({
    summary: "Permite cerrar sesión (API) para pruebas con Thunder Client",
  })
  @ApiBearerAuth("jwt-auth")
  @UseGuards(JwtAuthGuard)
  @Post("/signout/api")
  signOutApi(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("access_token", this.getClearCookieOptions());
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

  @Get("google")
  @UseGuards(AuthGuard("google"))
  googleLogin() {}

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
      this.config.get<string>("FRONTEND_URL") ||
      process.env.FRONT_URL ||
      "http://localhost:3005";

    return res.redirect(`${frontendUrl}/auth`);
  }

  @Post("forgot-password")
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.requestPasswordReset(dto.email);
    return { message: "Si el correo existe, enviaremos instrucciones." };
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

  @Get("me")
  @UseGuards(JwtAuthGuard)
  me(@Req() req: any) {
    return req.user;
  }
}
