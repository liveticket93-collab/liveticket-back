import { Injectable, NotFoundException } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { User } from "./entities/users.entity";
import { UpdateUserDto } from "./dto/users.dto";

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  ///Metodos
  createUser(data: Partial<User>) {
    return this.usersRepository.createUser(data);
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
}
