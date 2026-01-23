import { Injectable } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { EmailService } from "../email/sendgrid.service";

@Injectable()
export class OrdersService {
  constructor(private readonly emailService: EmailService) {}
  create(userId, createOrderDto: CreateOrderDto) {
    // const order = this.orderRepo.create({ ...dto, userId });
    // await this.orderRepo.save(order);

    // await this.emailService.sendPurchaseEmail(
    //   order.user.email,
    //   order.id,
    // );

    return "This action adds a new order";
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
