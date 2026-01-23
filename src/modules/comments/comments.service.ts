import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Comment } from "./entitie/comments.entity";
import { CreateCommentDto } from "./dto/comments.dto";
import { escapeHtml } from "./sanitize";


@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly repo: Repository<Comment>,
  ) {}

  async findVisible() {
    return this.repo.find({
      where: { visible: true },
      order: { createdAt: "DESC" },
    });
  }

  async create(dto: CreateCommentDto) {
    // Validación extra por seguridad (además del DTO)
    if (!dto.content || dto.content.trim().length === 0) {
      throw new BadRequestException("content no puede estar vacío");
    }

    const contentSafe = escapeHtml(dto.content.trim());

    let eventImageUrl: string | undefined = undefined;

    if (dto.eventImage) {
      // Si viene en formato data:image/...;base64,....
      const isDataUri = dto.eventImage.startsWith("data:image/");
      if (!isDataUri) {
        throw new BadRequestException("eventImage debe ser data URI de imagen");
      }

      eventImageUrl = dto.eventImage;
    }

    const comment = this.repo.create({
      name: dto.name.trim(),
      role: dto.role?.trim(),
      content: contentSafe,
      rating: dto.rating,
      image: dto.image,
      eventImage: eventImageUrl,
      verified: dto.verified,
      event: dto.event?.trim(),
      visible: true, // o false si quieres moderación
    });

    return this.repo.save(comment);
  }

}
