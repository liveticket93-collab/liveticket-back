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
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from "./dto/create-category.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Categories")
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

  @ApiOperation({
    summary: "Permite actulizar los datos de una categoría",
  })
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
