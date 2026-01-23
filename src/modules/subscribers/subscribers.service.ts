import { ConflictException, Injectable } from "@nestjs/common";
import { SubscribersRepository } from "./subscribers.repository";
import { CreateSubscriberDto } from "./dto/create-subscriber.dto";

@Injectable()
export class SubscribersService {
  constructor(
    private readonly subscribersRepository: SubscribersRepository,
  ) { }

  async create(dto: CreateSubscriberDto) {
    const email = dto.email.trim().toLowerCase();

    try {
      return await this.subscribersRepository.createSubscriber(email);
    } catch (err: any) {
      if (err?.code === "23505") {
        throw new ConflictException("El email ya está suscrito");
      }
      throw err;
    }
  }

  async findAllEmails() {
    return this.subscribersRepository.findAllEmails();
  }
}

