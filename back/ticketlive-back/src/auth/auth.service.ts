import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from '@nestjs/jwt';
import { JwtModule } from "@nestjs/jwt";
import { User } from "src/users/users.entity";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) { }

  async validateGoogleUser(googleUser: {
    googleId: string;
    email: string;
    name: string;
  }): Promise<User> {
    const { googleId, email, name } = googleUser;

    let user = await this.usersService.findByEmail(email);

    // Login
    if (user) {
      return user;
    }

    // Register
    user = await this.usersService.createFromGoogle({
      googleId,
      email,
      name,
      isAdmin: false,
    });

    return user;
  }

  async generateToken(user: { id: string; email: string }) {
    const payload = {
      sub: user.id,
      email: user.email,
    };
    return this.jwtService.sign(payload);
  }

}
