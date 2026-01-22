import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Subscriber } from "./entity/subscriber.entity";
import { CreateSubscriberDto } from "./dto/create-subscriber.dto";

@Injectable()
export class SubscribersService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly repo: Repository<Subscriber>,
  ) {}

  async create(dto: CreateSubscriberDto) {
    const email = dto.email.trim().toLowerCase();

    try {
      const subscriber = this.repo.create({ email });
      return await this.repo.save(subscriber);
    } catch (err: any) {
      if (err?.code === "23505") {
        throw new ConflictException("El email ya está suscrito");
      }
      throw err;
    }
  }

  async findAllEmails() {
    return this.repo.find({
      select: { email: true },
      order: { subscribedAt: "DESC" },
    });
  }
}
