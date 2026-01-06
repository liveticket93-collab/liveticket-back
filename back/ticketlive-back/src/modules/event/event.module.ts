import { Module } from "@nestjs/common";
import { EventsService } from "./event.service";
import { EventsController } from "./event.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Event } from "./entities/event.entity";
import { EventRepository } from "./event.repository";
//import { Category } from 'src/entities/categories.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  controllers: [EventsController],
  providers: [EventsService, EventRepository],
  exports: [EventRepository],
})
export class EventModule {}
