import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./entities/users.entity";
import { UpdateUserDto } from "./dto/users.dto";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>
  ) { }

  async getAllUsers(page, limit) {
    const skip = (page - 1) * limit;
    const userList = await this.repo.find({
      take: limit,
      skip: skip,
    });
    return userList.map(({ password, ...noPassword }) => noPassword);
  }

  async createUser(data: Partial<User>) {
    const user = this.repo.create(data);
    return await this.repo.save(user);
  }

  async getAlll(page: number, limit: number): Promise<User[]> {
    const skip = (page - 1) * limit;

    return await this.repo.find({
      skip,
      take: limit,
    });
  }

  async findByGoogleId(googleId: string) {
    const user = await this.repo.findOne({
      where: { googleId },
      relations: { orders: { order_detail: { event: true } } },
    });
    if (!user)
      throw new NotFoundException(`Usuario con id ${googleId} no encontrado`);
    const { password, isAdmin, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findByEmail(email: string) {
    return this.repo.findOne({
      where: { email },
      relations: { orders: { order_detail: { event: true } } },
    });
  }

  async findById(id: string) {
    const user = await this.repo.findOne({
      where: { id },
      relations: { orders: { order_detail: { event: true } } },
    });
    if (!user)
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateUser(id: string, newData: UpdateUserDto) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    Object.assign(user, newData);
    return await this.repo.save(user);
  }

  async deleteUser(id: string): Promise<Omit<User, "password">> {
    const user = await this.repo.findOneBy({ id });
    if (!user)
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    await this.repo.remove(user);
    const { password, ...noPassword } = user;
    return noPassword;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.repo.findOneBy({ email });
    return user;
  }

  async banUser(id: string, reason?: string): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) return null;

    user.isActive = false;
    user.bannedAt = new Date();
    user.banReason = reason ?? null;

    return this.repo.save(user);
  }

  async unbanUser(id: string): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) return null;

    user.isActive = true;
    user.bannedAt = null;
    user.banReason = null;

    return this.repo.save(user);
  }
}
