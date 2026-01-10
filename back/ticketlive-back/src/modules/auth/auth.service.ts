import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

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

    // Login
    if (user) {
      const { password, ...noPsw } = user;
      return noPsw;
    }

    // Register
    user = await this.usersService.createUser({
      googleId,
      email,
      name,
      isAdmin: false,
      profile_photo: highResPhoto,
    });
    const { password, ...noPsw } = user;
    return noPsw;
  }

  async generateToken(user: { id: string; email: string; isAdmin: boolean }) {
    const payload = {
      sub: user.id,
      email: user.email,
      isAdmin: user.isAdmin
    };
    return this.jwtService.sign(payload);
  }

  async signIn(email: string, password: string) {
    if (!email || !password)
      throw new BadRequestException("Email y password requeridos");

    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException(`Credenciales incorrectas..!!!`);

    const passwordValid = await bcrypt.compare(password, user.password!);
    if (!user || !passwordValid)
      throw new UnauthorizedException("Credenciales incorrectas");

    const { password: _, ...noPsw } = user;

    return noPsw;
  }

  async signUp(user) {
    //Verificar que no este registrado el usuario
    const isRegister = await this.usersService.findByEmail(user.email);
    if (isRegister)
      throw new BadRequestException("El email ya ha sido registrado");

    //Hashear password
    const hashPsw = await bcrypt.hash(user.password, 10);
    //Guardar usuario
    await this.usersService.createUser({ ...user, password: hashPsw });

    const newUser = await this.usersService.findByEmail(user.email);
    if (!newUser) {
      throw new NotFoundException("No se pudo crear el usuario");
    }

    const { password, ...noPsw } = newUser;
    return noPsw;
  }
}
