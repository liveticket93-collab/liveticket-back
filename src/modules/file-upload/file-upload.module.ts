import { Module } from "@nestjs/common";
import { FileUploadService } from "./file-upload.service";
import { FileUploadController } from "./file-upload.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/users.entity";
import { FileUploadRepository } from "./file-upload.repository";
import { CloudinaryConfig } from "src/config/cloudinary";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([User, Event]), UsersModule],
  controllers: [FileUploadController],
  providers: [FileUploadService, FileUploadRepository, CloudinaryConfig],
})
export class FileUploadModule {}
