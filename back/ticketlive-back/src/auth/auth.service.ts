import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtModule } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateGoogleUser(googleUser: {
    googleId: string;
    email: string;
    name: string;
  }) {
    const { googleId, email, name } = googleUser;

    let user = await this.usersService.findByEmail(email);

    //Login
    if (user) {
      return {
        message: "Usuario logeado",
        token: "token",
      };
    }

    //Register
    user = await this.usersService.createFromGoogle({
      googleId,
      email,
      name,
      isAdmin: false,
    });

    return user;
  }
}
