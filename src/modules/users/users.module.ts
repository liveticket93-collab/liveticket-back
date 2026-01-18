import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/users.entity";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { UsersRepository } from "./users.repository";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, UsersRepository],
  controllers: [UsersController],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
