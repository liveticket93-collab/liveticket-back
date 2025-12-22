import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { ConfigService } from '@nestjs/config';

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) { }

  @Get("google/login")
  @UseGuards(AuthGuard("google"))
  googleLogin() { } 

  @Get("google/register")
  @UseGuards(AuthGuard("google"))
  googleRegister() { } 

  
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req, @Res() res) {
    const user = await this.authService.validateGoogleUser(req.user);

    const token = await this.authService.generateToken(user);

    return res.redirect(
  `${this.config.get<string>('FRONT_URL')}${this.config.get<string>('FRONT_CALLBACK')}?token=${token}`);
  }

}
