import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) { }

  async signUp(user: { email: string; password: string; name: string }) {
    const { email, password, name } = user;
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      // throw new BadRequestException('User already exists'); // Usar BadRequestException si se desea
      return { message: "User already exists" }; // O retornar un mensaje
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.usersService.createWithPassword({
      email,
      password: hashedPassword,
      name,
      isAdmin: false,
    });
  }

  async signIn(loginData: { email: string; password?: string }) { // password opcional por si viene de Google? No, aquí es obligatorio
    const { email, password } = loginData;
    const user = await this.usersService.findByEmail(email);

    if (!user || !user.password) {
      // Si no tiene password es porque se registró con Google
      return { message: "Invalid credentials" };
    }

    const isMatch = await bcrypt.compare(password!, user.password!);
    if (!isMatch) {
      return { message: "Invalid credentials" };
    }

    const payload = { email: user.email, sub: user.id, isAdmin: user.isAdmin };

    return {
      message: "Login successful",
      token: this.jwtService.sign(payload),
      user
    };
  }

  async validateGoogleUser(googleUser: {
    googleId: string;
    email: string;
    name: string;
  }) {
    const { googleId, email, name } = googleUser;

    let user = await this.usersService.findByEmail(email);

    //Login
    if (user) {
      const payload = { email: user.email, sub: user.id, isAdmin: user.isAdmin };
      return {
        message: "Usuario logeado",
        token: this.jwtService.sign(payload),
      };
    }

    //Register
    user = await this.usersService.createFromGoogle({
      googleId,
      email,
      name,
      isAdmin: false,
    });

    const payload = { email: user.email, sub: user.id, isAdmin: user.isAdmin };

    return {
      message: "Usuario registrado con Google",
      token: this.jwtService.sign(payload),
      user
    };
  }
}
