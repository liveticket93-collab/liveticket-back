import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "src/modules/users/entities/users.entity";
import { OrderDetail } from "src/entities/orderDetails.entity";
import { Order } from "src/modules/orders/entities/order.entity";
import { Event } from "src/modules/event/entities/event.entity";

@Injectable()
export class OrderSeed {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>
  ) {}

  async run() {
    console.log("Seeding orders...");

    // Tomamos un usuario
    const user = await this.userRepository.findOne({
      where: { email: "johndoe@example.com" },
    });
    if (!user) {
      console.log("User not found. Cannot create orders.");
      return;
    }

    // Tomamos un evento para el detalle del pedido
    const event = await this.eventRepository.findOne({
      where: { title: "Concierto de Rock - The Rolling Codes" },
    });
    if (!event) {
      console.log("Event not found. Cannot create order details.");
      return;
    }

    // Creamos el OrderDetail
    const orderDetail = this.orderDetailRepository.create({
      event,
      quantity: 2,
      unit_price: event.price,
    });
    await this.orderDetailRepository.save(orderDetail);

    // Calculamos total
    const total = orderDetail.quantity * orderDetail.unit_price;

    // Verificamos si ya existe el pedido
    const existingOrder = await this.orderRepository.findOne({
      where: { user: { id: user.id } },
      relations: ["user"],
    });

    if (existingOrder) {
      console.log("Order already exists for this user.");
      return;
    }

    // Creamos el pedido
    const order = this.orderRepository.create({
      user,
      order_detail: orderDetail,
      total,
      date: new Date(),
      status: "PAID",
    });

    await this.orderRepository.save(order);
    console.log("Order created successfully");
  }
}
