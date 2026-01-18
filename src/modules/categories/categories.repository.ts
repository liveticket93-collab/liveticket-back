import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./entities/category.entity";
import { Repository } from "typeorm";

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>
  ) {}

  async create(category): Promise<Category> {
    const exists = await this.repository.findOne({
      where: { name: category.name },
    });
    if (exists)
      throw new ConflictException(`La categoría ${exists.name} ya existe`);
    const newCategory = this.repository.save(category);
    return newCategory;
  }
  async findAll(): Promise<Category[]> {
    return await this.repository.find();
  }

  async findById(id: string): Promise<Category | null> {
    return await this.repository.findOneBy({ id });
  }

  async update(id: string, newData): Promise<Category | null> {
    const category = await this.repository.update(id, newData);
    if (category.affected === 0)
      throw new NotFoundException(`No se encontró la categoría con id : ${id}`);
    return await this.repository.findOneBy({ id });
  }

  async remove(id: string): Promise<{ message: string }> {
    const category = await this.repository.findOne({ where: { id } });
    if (!category)
      throw new NotFoundException(`No se encontró la categoría con id : ${id}`);
    await this.repository.remove(category);
    return { message: `Categoría ${category.name} eliminada` };
  }
}
