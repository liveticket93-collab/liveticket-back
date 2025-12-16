import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { User } from "./users.entity";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>
  ) {}

  async createFromGoogle(data: Partial<User>) {
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

  async updateUSer(id: string, newData: UpdateUserDto) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    Object.assign(user, newData);
    return await this.repo.save(user);
  }
}
