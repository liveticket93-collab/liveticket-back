import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './users.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createFromGoogle(data: Partial<User>) {
    const user = this.usersRepository.create(data);
    return this.usersRepository.save(user);
  }

  findByGoogleId(googleId: string) {
    return this.usersRepository.findByGoogleId(googleId);
  }

  findById(id: string) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async updateProfile(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }
}
