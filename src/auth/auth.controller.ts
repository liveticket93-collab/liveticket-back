import { Controller, Get, Req, UseGuards, Post, Body } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // Endpoint de Auth Simple
  @Post("signup")
  signup(@Body() user: any) {
    return this.authService.signUp(user);
  }

  @Post("signin")
  signin(@Body() loginData: any) {
    return this.authService.signIn(loginData);
  }

  @Get("google/login")
  @UseGuards(AuthGuard("google"))
  googleLogin() { } //Nunca se ejecuta solo sirve para disparar el flujo OAuth

  @Get("google/register")
  @UseGuards(AuthGuard("google"))
  googleRegister() { } //Nunca se ejecuta solo sirve para disparar el flujo OAuth

  //Google vuelve con code -> Passport valida con Google -> Se ejecuta tu GoogleStrategy.validate -> Resultadi queda en req.user
  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleAuthCallback(@Req() req) {
    const user = await this.authService.validateGoogleUser(req.user);
    return user;
  }
}
