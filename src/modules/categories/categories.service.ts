import { Injectable } from "@nestjs/common";
import { CategoryRepository } from "./categories.repository";

@Injectable()
export class CategoriesService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  create(category) {
    return this.categoryRepository.create(category);
  }

  findAll() {
    return this.categoryRepository.findAll();
  }

  findOne(id: string) {
    return this.categoryRepository.findById(id);
  }

  update(id: string, data) {
    return this.categoryRepository.update(id, data);
  }

  remove(id: string) {
    return this.categoryRepository.remove(id);
  }
}
