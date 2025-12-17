import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { User } from "./users.entity";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>
  ) { }

  async createWithPassword(userData: Partial<User>) {
    const newUser = this.usersRepository.create(userData);
    return await this.usersRepository.save(newUser);
  }

  async createFromGoogle(data: Partial<User>) {
    const user = this.usersRepository.create(data);
    return await this.usersRepository.save(user);
  }

  async findByGoogleId(googleId: string) {
    return await this.usersRepository.findOne({ where: { googleId } });
  }

  async findByEmail(email: string) {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async updateUSer(id: string, newData: UpdateUserDto) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    Object.assign(user, newData);
    return await this.usersRepository.save(user);
  }
}
