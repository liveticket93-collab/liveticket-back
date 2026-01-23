import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Subscriber } from "./entity/subscriber.entity";

@Injectable()
export class SubscribersRepository {
  constructor(
    @InjectRepository(Subscriber)
    private readonly repo: Repository<Subscriber>,
  ) {}

  createSubscriber(email: string): Promise<Subscriber> {
    const subscriber = this.repo.create({ email });
    return this.repo.save(subscriber);
  }

  findAllEmails(): Promise<Pick<Subscriber, "email">[]> {
    return this.repo.find({
      select: { email: true },
      order: { subscribedAt: "DESC" },
    });
  }

  findByEmail(email: string): Promise<Subscriber | null> {
    return this.repo.findOne({
      where: { email },
    });
  }
}
