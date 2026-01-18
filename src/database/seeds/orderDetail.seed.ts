import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OrderDetail } from "src/entities/orderDetails.entity";
import { Event } from "src/modules/event/entities/event.entity";

@Injectable()
export class OrderDetailSeed {
  constructor(
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>
  ) {}

  async run() {
    console.log("Seeding order details...");

    // 1️⃣ Tomamos un evento existente
    const event = await this.eventRepository.findOne({
      where: { title: "Concierto de Rock - The Rolling Codes" },
    });

    if (!event) {
      console.log("Event not found. Cannot create order details.");
      return;
    }

    // 2️⃣ Verificamos si ya existe un OrderDetail para este evento
    const existingDetail = await this.orderDetailRepository.findOne({
      where: { event: { id: event.id } },
    });

    if (existingDetail) {
      console.log("OrderDetail already exists for this event.");
      return;
    }

    // 3️⃣ Creamos el OrderDetail
    const orderDetail = this.orderDetailRepository.create({
      event,
      quantity: 2, // compra de 2 tickets
      unit_price: event.price, // precio del evento
    });

    await this.orderDetailRepository.save(orderDetail);

    console.log("OrderDetail created successfully");
  }
}
