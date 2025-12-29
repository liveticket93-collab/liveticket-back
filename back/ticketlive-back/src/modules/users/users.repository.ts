import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./entities/users.entity";
import { UpdateUserDto } from "./dto/users.dto";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>
  ) {}

  async createUser(data: Partial<User>) {
    const user = this.repo.create(data);
    return await this.repo.save(user);
  }

  async findByGoogleId(googleId: string) {
    return await this.repo.findOne({ where: { googleId } });
  }

  async findByEmail(email: string) {
    return await this.repo.findOne({ where: { email } });
  }

  async findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async updateUser(id: string, newData: UpdateUserDto) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    Object.assign(user, newData);
    return await this.repo.save(user);
  }
}
