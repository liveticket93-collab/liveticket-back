import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { EmailService } from "../email/email.service";
import * as crypto from "crypto";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService
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

    // Enviar email
    await this.emailService.sendRegisterEmail(user.email, user.name);

    return noPsw;
  }

  async generateToken(user: { id: string; email: string; isAdmin: boolean }) {
    const payload = {
      sub: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
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

    if (!user.isActive) {
      throw new ForbiddenException("Usuario baneado");
    }

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

    // Enviar email
    await this.emailService.sendRegisterEmail(user.email, user.name);

    return noPsw;
  }

  async requestPasswordReset(email: string): Promise<void> {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await this.usersService.findByEmail(normalizedEmail);

    if (!user) return;

    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = await bcrypt.hash(resetToken, 10);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await this.usersService.updateUserFields(user.id, {
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpiresAt: expiresAt,
    });

    const resetLink = `${process.env.FRONT_URL}/reset-password?token=${resetToken}`;

    await this.emailService.sendResetPasswordEmail(
      user.email,
      user.name,
      resetLink
    );
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    if (!token || !newPassword) {
      throw new BadRequestException("Token y nueva contraseña requeridos");
    }

    const candidates = await this.usersService.findUsersWithActiveResetToken();

    const user = await this.findUserByMatchingResetToken(candidates, token);

    if (!user) {
      throw new BadRequestException("Token inválido o expirado");
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await this.usersService.updateUserFields(user.id, {
      password: hashed,
      resetPasswordTokenHash: null,
      resetPasswordExpiresAt: null,
    });
  }

  private async findUserByMatchingResetToken(users: any[], rawToken: string) {
    for (const u of users) {
      if (!u.resetPasswordTokenHash) continue;

      const ok = await bcrypt.compare(rawToken, u.resetPasswordTokenHash);
      if (ok) return u;
    }
    return null;
  }

  async changePassword(
    userFromReq: any,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    if (!currentPassword || !newPassword) {
      throw new BadRequestException(
        "Contraseña actual y nueva contraseña requeridas"
      );
    }

    const userId = userFromReq.sub ?? userFromReq.id;

    const user = await this.usersService.findByIdWithPassword(userId);
    if (!user) throw new NotFoundException("Usuario no encontrado");

    const ok = await bcrypt.compare(currentPassword, user.password!);
    if (!ok)
      throw new UnauthorizedException("La contraseña actual no es correcta");

    const hashed = await bcrypt.hash(newPassword, 10);

    await this.usersService.updateUserFields(user.id, {
      password: hashed,
    });
  }
}
