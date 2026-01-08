import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "src/modules/categories/entities/category.entity";
import { Event } from "src/modules/event/entities/event.entity";
import { Repository } from "typeorm";

@Injectable()
export class EventSeed {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  async run() {
    console.log("Seeding events...");

    // Traemos categorías existentes
    const concertsCategory = await this.categoryRepository.findOneBy({
      name: "Conciertos",
    });
    const sportsCategory = await this.categoryRepository.findOneBy({
      name: "Deportes",
    });

    if (!concertsCategory || !sportsCategory) {
      console.log(
        "Error: Debes crear las categorías antes de crear los eventos."
      );
      return;
    }

    const eventsData = [
      {
        title: "Concierto de Rock - The Rolling Codes",
        description: "Una noche épica de rock con The Rolling Codes.",
        date: new Date("2026-03-15"),
        start_time: new Date("2026-03-15T20:00:00"),
        end_time: new Date("2026-03-15T23:00:00"),
        location: "Auditorio Central",
        capacity: 5000,
        price: 120,
        imageUrl: "https://brandemia.org/contenido/subidas/2012/07/the-rolling-stones-logo.webp",
        status: true,
        category: concertsCategory,
      },
      {
        title: "Partido de Fútbol - Liga CodeStars",
        description: "Encuentro de la temporada entre CodeStars y DevUnited.",
        date: new Date("2026-04-10"),
        start_time: new Date("2026-04-10T18:00:00"),
        end_time: new Date("2026-04-10T20:30:00"),
        location: "Estadio Principal",
        capacity: 30000,
        price: 80,
        imageUrl: "https://images.mlssoccer.com/image/private/t_editorial_landscape_8_desktop_mobile/mls/ijpkzjmnm403ikmbytgg.jpg",
        status: true,
        category: sportsCategory,
      },
      {
        title: "Concierto de Pop - Jane Coder",
        description: "Jane Coder en vivo con todos sus éxitos.",
        date: new Date("2026-05-05"),
        start_time: new Date("2026-05-05T19:30:00"),
        end_time: new Date("2026-05-05T22:00:00"),
        location: "Teatro Principal",
        capacity: 2500,
        price: 100,
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Bad_album_logo.svg/2560px-Bad_album_logo.svg.png",
        status: true,
        category: concertsCategory,
      },
    ];

    for (const eventData of eventsData) {
      const existingEvent = await this.eventRepository.findOneBy({
        title: eventData.title,
      });
      if (!existingEvent) {
        const event = this.eventRepository.create(eventData); // <-- create() antes de save
        await this.eventRepository.save(event);
        console.log(`Event "${event.title}" created`);
      } else {
        console.log(`Event "${eventData.title}" already exists`);
      }
    }

    console.log("Events seeding finished!");
  }
}
