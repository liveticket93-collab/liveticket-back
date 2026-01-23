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
import {
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
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

  @ApiOperation({
    summary: "Iniciar sesión (web)",
    description:
      "Valida credenciales, setea cookie httpOnly `access_token` y redirige al FRONTEND_URL.",
  })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ status: 302, description: "Redirección al frontend" })
  @ApiResponse({ status: 401, description: "Credenciales inválidas" })
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

  @ApiOperation({
    summary: "Iniciar sesión (API)",
    description:
      "Valida credenciales, setea cookie httpOnly `access_token` y devuelve JSON (útil para Thunder Client / front local).",
  })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ status: 200, description: "Login OK (cookie seteada)" })
  @ApiResponse({ status: 401, description: "Credenciales inválidas" })
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
    summary: "Cerrar sesión (web)",
    description:
      "Elimina la cookie `access_token` y redirige al FRONTEND_URL. Requiere estar autenticado.",
  })
  @ApiBearerAuth("jwt-auth")
  @ApiCookieAuth("access_token")
  @ApiResponse({ status: 302, description: "Redirección al frontend" })
  @ApiResponse({ status: 401, description: "No autenticado" })
  @ApiResponse({ status: 403, description: "Usuario baneado / Forbidden" })
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
    summary: "Cerrar sesión (API)",
    description:
      "Elimina la cookie `access_token` y devuelve JSON. Útil para pruebas con Thunder Client / front local. Requiere estar autenticado.",
  })
  @ApiBearerAuth("jwt-auth")
  @ApiCookieAuth("access_token")
  @ApiResponse({ status: 200, description: "Sesión cerrada exitosamente" })
  @ApiResponse({ status: 401, description: "No autenticado" })
  @ApiResponse({ status: 403, description: "Usuario baneado / Forbidden" })
  @UseGuards(JwtAuthGuard)
  @Post("/signout/api")
  signOutApi(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("access_token", this.getClearCookieOptions());
    return { message: "Sesión cerrada exitosamente" };
  }

  @ApiOperation({
    summary: "Registro de usuario",
    description:
      "Crea un usuario, genera token, setea cookie httpOnly `access_token` y devuelve JSON.",
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: "Usuario creado exitosamente" })
  @ApiResponse({ status: 409, description: "Email ya registrado" })
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
    summary: "Iniciar sesión con Google",
    description:
      "Redirige al flujo OAuth de Google. (Se debe abrir en navegador; no es ideal para fetch).",
  })
  @ApiResponse({ status: 302, description: "Redirección a Google OAuth" })
  @Get("google")
  @UseGuards(AuthGuard("google"))
  googleLogin() {}

  @ApiOperation({
    summary: "Callback de Google OAuth",
    description:
      "Recibe usuario de Google, valida/crea usuario en DB, setea cookie httpOnly `access_token` y redirige al frontend.",
  })
  @ApiResponse({ status: 302, description: "Redirección al frontend (/auth)" })
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

  @ApiOperation({
    summary: "Solicitar reset de contraseña",
    description:
      "Envía instrucciones al correo si existe. (Siempre responde igual para no filtrar usuarios).",
  })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: 200, description: "Solicitud procesada" })
  @Post("forgot-password")
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.requestPasswordReset(dto.email);
    return { message: "Si el correo existe, enviaremos instrucciones." };
  }

  @ApiOperation({
    summary: "Resetear contraseña",
    description: "Resetea la contraseña usando el token enviado por correo.",
  })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: "Contraseña actualizada correctamente" })
  @ApiResponse({ status: 400, description: "Token inválido/expirado" })
  @Post("reset-password")
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto.token, dto.newPassword);
    return { message: "Contraseña actualizada correctamente." };
  }

  @ApiOperation({
    summary: "Cambiar contraseña (usuario autenticado)",
    description:
      "Cambia la contraseña del usuario autenticado validando la contraseña actual.",
  })
  @ApiBearerAuth("jwt-auth")
  @ApiCookieAuth("access_token")
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({ status: 200, description: "Contraseña cambiada correctamente" })
  @ApiResponse({ status: 401, description: "No autenticado" })
  @ApiResponse({ status: 403, description: "Usuario baneado / Forbidden" })
  @ApiResponse({ status: 400, description: "Contraseña actual incorrecta" })
  @UseGuards(JwtAuthGuard)
  @Post("change-password")
  async changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    await this.authService.changePassword(
      req.user,
      dto.currentPassword,
      dto.newPassword
    );
    return { message: "Contraseña cambiada correctamente." };
  }

  @ApiOperation({
    summary: "Obtener usuario autenticado",
    description:
      "Devuelve el usuario actual a partir del JWT (cookie `access_token` o Bearer token).",
  })
  @ApiBearerAuth("jwt-auth")
  @ApiCookieAuth("access_token")
  @ApiResponse({ status: 200, description: "Usuario autenticado" })
  @ApiResponse({ status: 401, description: "No autenticado" })
  @ApiResponse({ status: 403, description: "Usuario baneado / Forbidden" })
  @UseGuards(JwtAuthGuard)
  @Get("me")
  me(@Req() req: any) {
    return req.user;
  }
}

