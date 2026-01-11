import {
  Controller,
  Patch,
  Param,
  Body,
  Get,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/users.dto";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UUID } from "typeorm/driver/mongodb/bson.typings.js";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch(":id")
  updateProfile(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateProfile(id, updateUserDto);
  }

  //Necessary for the Google front-end login
  @Get("me")
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req) {
    return req.user;
  }

  // @ApiBearerAuth("jwt-auth")
  // @UseGuards(JwtAuthGuard)
  @Get("profile/:id")
  getProfile(@Req() req, @Param("id") id: string) {
    return this.usersService.findById(id);
  }
}
