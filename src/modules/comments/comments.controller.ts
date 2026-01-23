import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto/comments.dto";

@ApiTags("Comments")
@Controller("api/comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: "Listar testimonios visibles" })
  @ApiResponse({ status: 200 })
  @Get()
  getAllVisible() {
    return this.commentsService.findVisible();
  }

  @ApiOperation({ summary: "Crear testimonio" })
  @ApiResponse({ status: 201 })
  @Post()
  create(@Body() dto: CreateCommentDto) {
    return this.commentsService.create(dto);
  }
}
