import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "src/modules/categories/entities/category.entity";
import { Repository } from "typeorm";

@Injectable()
export class CategorySeed {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  async run() {
    console.log("Seeding categories...");

    const categories: string[] = [
      "Conciertos",
      "Deportes",
      "Teatro",
      "Festivales",
      "Conferencias",
    ];

    for (const name of categories) {
      const exists = await this.categoryRepository.findOneBy({ name });

      if (!exists) {
        const category = this.categoryRepository.create({ name });
        await this.categoryRepository.save(category);
        console.log(`Category "${name}" created`);
      } else {
        console.log(`Category "${name}" already exists`);
      }
    }

    console.log("Categories seeding finished!");
  }
}
