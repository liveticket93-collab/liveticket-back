import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateSubscriberDto } from "./dto/create-subscriber.dto";
import { SubscribersService } from "./subscribers.service";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard"; 
import { RolesGuard } from "src/roles/roles.guard";
import { Roles } from "src/roles/roles.decorator";
import { Role } from "src/roles/roles.enum";
        

@ApiTags("Subscribers")
@Controller("api/subscribers")
export class SubscribersController {
  constructor(private readonly service: SubscribersService) {}

  @ApiOperation({ summary: "Crear suscripción" })
  @Post()
  create(@Body() dto: CreateSubscriberDto) {
    return this.service.create(dto);
  }

  @ApiOperation({ summary: "Listar suscriptores (solo admin)" })
  @ApiBearerAuth("jwt-auth")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  findAllEmails() {
    return this.service.findAllEmails();
  }
}
