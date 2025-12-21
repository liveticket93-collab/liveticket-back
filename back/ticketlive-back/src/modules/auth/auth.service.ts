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
    photo: string;
  }) {
    const { googleId, email, name, photo } = googleUser;

    let user = await this.usersService.findByEmail(email);
    const highResPhoto = photo
      ? photo.slice(0, photo.lastIndexOf("=")) + "=s1000-c"
      : null;

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
      profile_photo: highResPhoto,
    });

    return user;
  }
}
