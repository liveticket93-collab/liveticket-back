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
  ) { }

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
        description:
          "Prepárate para vivir una noche inolvidable llena de energía, guitarras potentes y una atmósfera electrizante con The Rolling Codes. Esta banda icónica promete un espectáculo de rock de alto nivel, combinando clásicos que han marcado generaciones con nuevos temas que demuestran su evolución musical. El Auditorio Central vibrará con cada acorde, ofreciendo una experiencia sonora y visual impresionante gracias a una producción de primer nivel. Será una oportunidad única para cantar, saltar y conectar con otros fanáticos del rock en un ambiente cargado de pasión, adrenalina y emoción. Ideal tanto para seguidores fieles como para quienes desean disfrutar de un concierto épico.\n\nComo dato interesante, The Rolling Codes es conocida por improvisar solos únicos en cada presentación, lo que hace que ningún concierto sea igual a otro. Además, la banda suele interactuar constantemente con el público, creando momentos memorables e inesperados. Este evento contará con un sistema de sonido especialmente calibrado para el recinto, garantizando una calidad acústica excepcional y una experiencia aún más envolvente para todos los asistentes.",
        date: "2026-03-15",
        start_time: new Date("2026-03-15T20:00:00"),
        end_time: new Date("2026-03-15T23:00:00"),
        location: "Auditorio Central",
        latitude: 4.6486,
        longitude: -74.0648,
        capacity: 5000,
        price: 120,
        imageUrl:
          "https://brandemia.org/contenido/subidas/2012/07/the-rolling-stones-logo.webp",
        status: true,
        category: concertsCategory,
      },
      {
        title: "Partido de Fútbol - Liga CodeStars",
        description:
          "Vive la emoción del fútbol profesional en un enfrentamiento clave de la temporada entre CodeStars y DevUnited. Dos equipos con gran nivel competitivo se verán las caras en el Estadio Principal, ofreciendo un partido lleno de intensidad, estrategia y jugadas espectaculares. Los aficionados podrán disfrutar de un ambiente vibrante, con cánticos, celebraciones y la pasión característica del deporte rey. Este encuentro promete momentos decisivos que podrían marcar el rumbo de la liga, convirtiéndose en una cita imperdible para los amantes del fútbol. Ideal para asistir en familia o con amigos y disfrutar de una experiencia deportiva completa.\n\nUn dato destacado es que ambos equipos cuentan con jugadores jóvenes considerados promesas de la liga, lo que añade un atractivo especial al partido. Históricamente, los enfrentamientos entre CodeStars y DevUnited han sido muy parejos y emocionantes, con resultados definidos en los últimos minutos. Además, el estadio ofrecerá actividades previas al partido, como música en vivo y zonas gastronómicas para el disfrute del público.",
        date: "2026-04-10",
        start_time: new Date("2026-04-10T18:00:00"),
        end_time: new Date("2026-04-10T20:30:00"),
        location: "Estadio Principal",
        latitude: 6.2569,
        longitude: -75.5906,
        capacity: 30000,
        price: 80,
        imageUrl:
          "https://images.mlssoccer.com/image/private/t_editorial_landscape_8_desktop_mobile/mls/ijpkzjmnm403ikmbytgg.jpg",
        status: true,
        category: sportsCategory,
      },
      {
        title: "Concierto de Pop - Jane Coder",
        description:
          "Disfruta de una noche mágica con Jane Coder en vivo, una de las artistas pop más destacadas del momento. En el Teatro Principal, la cantante ofrecerá un show cargado de emoción, coreografías vibrantes y una puesta en escena cuidadosamente diseñada para conectar con el público. Interpretará todos sus grandes éxitos, así como nuevas canciones que reflejan su crecimiento artístico. Este concierto es perfecto para quienes buscan una experiencia musical moderna, llena de ritmo y sentimiento. Una oportunidad ideal para cantar, bailar y vivir de cerca el talento y carisma de Jane Coder.\n\nComo dato interesante, Jane Coder participa activamente en la creación de sus espectáculos, desde el diseño visual hasta la selección del repertorio. En esta gira incorpora tecnología de iluminación interactiva que responde al ritmo de la música, creando una experiencia inmersiva. Además, suele sorprender al público con versiones acústicas exclusivas, lo que convierte cada presentación en un evento único y muy especial para sus seguidores.",
        date: "2026-05-05",
        start_time: new Date("2026-05-05T19:30:00"),
        end_time: new Date("2026-05-05T22:00:00"),
        location: "Teatro Principal",
        latitude: 4.7100,
        longitude: -74.0721,
        capacity: 2500,
        price: 100,
        imageUrl:
          "https://images.squarespace-cdn.com/content/66a2b4e1f052404e0f9eef25/4aac2f1e-a5b8-4a39-a545-7ec441843858/Social+Sharing+Image.png?format=1500w&content-type=image%2Fpng",
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
        if (existingEvent.latitude == null || existingEvent.longitude == null) {
          await this.eventRepository.update(existingEvent.id, {
            latitude: eventData.latitude,
            longitude: eventData.longitude,
          });
          console.log(`Event "${eventData.title}" updated with coordinates`);
        }
        else {
          console.log(`Event "${eventData.title}" already exists`);
        }
      }
    }
    console.log("Events seeding finished!");
  }
}
