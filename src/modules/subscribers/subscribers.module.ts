import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Subscriber } from "./entity/subscriber.entity";
import { SubscribersController } from "./subscribers.controller";
import { SubscribersService } from "./subscribers.service";

@Module({
  imports: [TypeOrmModule.forFeature([Subscriber])],
  controllers: [SubscribersController],
  providers: [SubscribersService],
})
export class SubscribersModule {}
