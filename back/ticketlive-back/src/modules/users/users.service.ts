import { Injectable, NotFoundException } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { User } from "./entities/users.entity";
import { UpdateUserDto } from "./dto/users.dto";

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) { }

  ///Metodos
  createUser(data: Partial<User>) {
    return this.usersRepository.createUser(data);
  }

  getAllUsers(page, limit) {
    return this.usersRepository.getAllUsers(page, limit);
  }

  findByGoogleId(googleId: string) {
    return this.usersRepository.findByGoogleId(googleId);
  }

  findById(id: string) {
    return this.usersRepository.findById(id);
  }

  findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  updateProfile(id: string, updateUserDto: UpdateUserDto) {
    return this.usersRepository.updateUser(id, updateUserDto);
  }

  deleteUser(id: string) {
    return this.usersRepository.deleteUser(id);
  }

  async banUser(id: string, reason?: string) {
    const user = await this.usersRepository.banUser(id, reason);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return {
      id: user.id,
      isActive: user.isActive,
      bannedAt: user.bannedAt,
      banReason: user.banReason,
    };
  }

  async unbanUser(id: string) {
    const user = await this.usersRepository.unbanUser(id);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return {
      id: user.id,
      isActive: user.isActive,
      bannedAt: user.bannedAt,
      banReason: user.banReason,
    };
  }
}
