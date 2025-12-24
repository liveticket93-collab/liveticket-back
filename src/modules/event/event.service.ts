import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { EventRepository } from "./event.repository";
import { Event } from "./entities/event.entity";

@Injectable()
export class EventsService {
  constructor(private readonly eventRepository: EventRepository) {}

  async findAll(page = 1, limit = 10): Promise<Event[]> {
    return this.eventRepository.getEvents(page, limit);
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventRepository.getById(id);

    if (!event) {
      throw new NotFoundException("Event not found");
    }

    return event;
  }

  async create(createEventDto: CreateEventDto): Promise<Event> {
    return await this.eventRepository.createEvent(createEventDto);
  }

  async update(
    id: string,
    updateEventDto: UpdateEventDto
  ): Promise<{ id: string }> {
    const result = await this.eventRepository.updateEvent(id, updateEventDto);

    if (!result) {
      throw new NotFoundException("Event not found");
    }

    return result;
  }

  async remove(id: string): Promise<{ id: string }> {
    const result = await this.eventRepository.deleteEvent(id);

    if (!result) {
      throw new NotFoundException("Event not found");
    }

    return result;
  }
}
