import { PartialType } from "@nestjs/swagger";

export class FileUploadBaseDto {}

export class UpdateFileUploadDto extends PartialType(FileUploadBaseDto) {}
