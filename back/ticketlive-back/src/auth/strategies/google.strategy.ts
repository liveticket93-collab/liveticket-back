import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-google-oauth20";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>("GOOGLE_CLIENT_ID")!,
      clientSecret: configService.get<string>("GOOGLE_CLIENT_SECRET")!,
      callbackURL: configService.get<string>("GOOGLE_CALLBACK_URL")!,
      scope: ["email", "profile"],
      passReqToCallback: false,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    if (!profile.emails || profile.emails.length === 0) {
      throw new UnauthorizedException("Google account has no email");
    }

    return {
      googleId: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
    };

  }
}
