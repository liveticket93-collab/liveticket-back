import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService
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

    res.cookie('access_token', token, {
      httpOnly: true,       
      secure: false,        
      sameSite: 'lax',      
      maxAge: 24 * 60 * 60 * 1000, 
    });

    return res.redirect(
      `${this.config.get<string>('FRONT_URL')}${this.config.get<string>('FRONT_CALLBACK')}`
    );
  }

}
