import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { UsersRepository } from "src/modules/users/users.repository";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersRepository: UsersRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: any) => req?.cookies?.access_token,          
        ExtractJwt.fromAuthHeaderAsBearerToken(),          
      ]),
      secretOrKey: configService.getOrThrow<string>("JWT_SECRET"),
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    const userId = payload.sub;

    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new UnauthorizedException("Usuario no existe");
    }

    if (!user.isActive) {
      throw new ForbiddenException("Usuario baneado");
    }

    return {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
      sub: payload.sub, 
    };
  }
}

