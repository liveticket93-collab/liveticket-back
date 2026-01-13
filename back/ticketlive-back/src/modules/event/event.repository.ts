import { Injectable } from "@nestjs/common";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Event } from "./entities/event.entity";

@Injectable()
export class EventRepository {
  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>
  ) { }

  async getEvents(page: number, limit: number): Promise<Event[]> {
    const skip = (page - 1) * limit;

    return await this.repository.find({
      skip,
      take: limit,
    });
  }

  async getById(id: string): Promise<Event | null> {
    return this.repository.findOne({
      where: { id },
      relations: { category: true },
    });
  }

  async createEvent(createEventDto: CreateEventDto): Promise<Event> {
    const event = this.repository.create(createEventDto);
    return await this.repository.save(event);
  }

  async updateEvent(
    id: string,
    updateEventDto: UpdateEventDto
  ): Promise<{ id: string } | null> {
    const result = await this.repository.update(id, updateEventDto);
    if (result.affected === 0) {
      return null;
    }

    return { id };
  }

  async deleteEvent(id: string): Promise<{ id: string } | null> {
    const result = await this.repository.delete(id);

    if (result.affected === 0) {
      return null;
    }

    return { id };
  }

  async save(event: Event): Promise<Event> {
    return this.repository.save(event);
  }

  findById(id: string): Promise<Event | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

}
