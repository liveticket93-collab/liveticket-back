import {
  Controller,
  Patch,
  Param,
  Body,
  Get,
  UseGuards,
  Req,
  ParseUUIDPipe,
  Query,
  Delete,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { BanUserDto, UpdateUserDto } from "./dto/users.dto";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { UUID } from "typeorm/driver/mongodb/bson.typings.js";
import { User } from "./entities/users.entity";
import { RolesGuard } from "src/roles/roles.guard";
import { Roles } from "src/roles/roles.decorator";
import { Role } from "src/roles/roles.enum";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ApiOperation({
    summary: "Permite obtener todos los usuarios",
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
  getAllUsers(@Query("page") page: string, @Query("limit") limit: string) {
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const validPage = !isNaN(pageNum) && pageNum > 0 ? pageNum : 1;
    const validlimit = !isNaN(limitNum) && limitNum > 0 ? limitNum : 5;
    return this.usersService.getAllUsers(validPage, validlimit);
  }

  // @ApiBearerAuth("jwt-auth")
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Permite obtener toda la información referente a un usuario",
  })
  @Get("profile/:id")
  getProfile(@Req() req, @Param("id") id: string) {
    return this.usersService.findById(id);
  }

  @ApiOperation({
    summary: "Permite actulizar los datos de un usuario",
  })
  @Patch(":id")
  updateProfile(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateProfile(id, updateUserDto);
  }

  @ApiOperation({
    summary: "Permite eliminar un usuario por su id",
  })
  @Delete(":id")
  deleteUser(@Param("id", ParseUUIDPipe) id: string) {
    return this.usersService.deleteUser(id);
  }

  @ApiOperation({
    summary: "Permite banear un usuario por su id",
  })
  @Patch(":id/ban")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  banUser(@Param("id") id: string, @Body() dto: BanUserDto) {
    return this.usersService.banUser(id, dto.reason);
  }

  @ApiOperation({
    summary: "Permite desbanear un usuario por su id",
  })
  @Patch(":id/unban")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  unbanUser(@Param("id") id: string) {
    return this.usersService.unbanUser(id);
  }
}
