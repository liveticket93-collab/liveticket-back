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


@Controller("events")
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async findAll(
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ): Promise<Event[]> {
    return this.eventsService.findAll(Number(page) || 1, Number(limit) || 10);
  }

  @Get(":id")
  async findOne(@Param("id", new ParseUUIDPipe()) id: string): Promise<Event> {
    return this.eventsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async create(@Body() createEventDto: CreateEventDto): Promise<Event> {
    return this.eventsService.create(createEventDto);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async update(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() updateEventDto: UpdateEventDto
  ): Promise<{ id: string }> {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async remove(
    @Param("id", new ParseUUIDPipe()) id: string
  ): Promise<{ id: string }> {
    return this.eventsService.remove(id);
  }
}

