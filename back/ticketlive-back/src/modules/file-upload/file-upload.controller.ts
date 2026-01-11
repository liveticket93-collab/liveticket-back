import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseInterceptors,
} from "@nestjs/common";
import { FileUploadService } from "./file-upload.service";
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";

@ApiTags("File Upload")
@Controller("file-upload")
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @ApiOperation({
    summary: "Permite almacenar una imagen de perfil de un usuario",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor("file"))
  @Post("profileImage/:id")
  async uploadProfileImage(
    @Param("id", ParseUUIDPipe) userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1000000,
            message: "Suba una imagen menor a 1MB",
          }),
          new FileTypeValidator({
            fileType: /image\/(jpg|jpeg|png|svg\+xml|webp)$/i,
          }),
        ],
      })
    )
    file: Express.Multer.File
  ) {
    return this.fileUploadService.uploadProfileImage(userId, file);
  }
}
