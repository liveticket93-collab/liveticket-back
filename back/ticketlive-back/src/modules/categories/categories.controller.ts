import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { ApiOperation } from "@nestjs/swagger";

@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: "Permite crear una nueva categoría" })
  @Post()
  create(@Body() category: CreateCategoryDto) {
    return this.categoriesService.create(category);
  }
  @ApiOperation({ summary: "Permite obtener todas las categorías" })
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @ApiOperation({ summary: "Permite obtener una categoría segun su id" })
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() categoryData: UpdateCategoryDto) {
    return this.categoriesService.update(id, categoryData);
  }

  @ApiOperation({ summary: "Permite eliminar una categoría segun su id" })
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.categoriesService.remove(id);
  }
}
