import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("Orders")
@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({
    summary: "Crear una nueva orden",
  })
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    const userId = "1234";
    return this.ordersService.create(userId, createOrderDto);
  }

  @ApiOperation({
    summary: "Permite obtener todas las ordenes",
  })
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @ApiOperation({
    summary: "Permite obtener una orden por su id",
  })
  @ApiParam({
    name: "id",
    description: "ID de la orden",
  })
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.ordersService.findOne(+id);
  }

  @ApiOperation({
    summary: "Permite actualizar una orden de compra",
  })
  @ApiParam({
    name: "id",
    description: "ID de la orden a actualizar",
  })
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @ApiOperation({
    summary: "Permite eliminar una orden de compra",
  })
  @ApiParam({
    name: "id",
    description: "ID de la orden a eliminar",
  })
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.ordersService.remove(+id);
  }
}
