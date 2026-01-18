import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from "@nestjs/common";
import { EventsService } from "./event.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { Event } from "./entities/event.entity";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { Roles } from "src/roles/roles.decorator";
import { RolesGuard } from "src/roles/roles.guard";
import { Role } from "src/roles/roles.enum";
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";

@ApiTags("Events")
@Controller("events")
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiOperation({
    summary: "Permite obtener todos los eventos",
  })
  @ApiQuery({
    name: "page",
    required: false,
    type: String,
    description: "Número de página",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: String,
    description: "Elementos por página",
  })
  @Get()
  async findAll(
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ): Promise<Event[]> {
    return this.eventsService.findAll(Number(page) || 1, Number(limit) || 10);
  }

  @ApiOperation({
    summary: "Permite obtener toda la información de un evento",
  })
  @ApiParam({
    name: "id",
    description: "ID del evento",
  })
  @Get(":id")
  async findOne(@Param("id", new ParseUUIDPipe()) id: string): Promise<Event> {
    return this.eventsService.findOne(id);
  }

  @ApiOperation({
    summary: "Crear una nuevo evento",
  })
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async create(@Body() createEventDto: CreateEventDto): Promise<Event> {
    return this.eventsService.create(createEventDto);
  }

  @ApiOperation({
    summary: "Permite actulizar los datos de un evento",
  })
  @ApiParam({
    name: "id",
    description: "ID del evento",
  })
  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async update(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() updateEventDto: UpdateEventDto
  ): Promise<{ id: string }> {
    return this.eventsService.update(id, updateEventDto);
  }

  @ApiOperation({
    summary: "Permite eliminar los datos de un evento",
  })
  @ApiParam({
    name: "id",
    description: "ID del evento",
  })
  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async remove(
    @Param("id", new ParseUUIDPipe()) id: string
  ): Promise<{ id: string }> {
    return this.eventsService.remove(id);
  }
}
