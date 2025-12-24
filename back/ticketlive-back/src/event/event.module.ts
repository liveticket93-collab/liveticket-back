import { Module } from '@nestjs/common';
import { EventService } from "./event.service"
import { EventsController } from "./event.controller"
import { EventRepository } from "./event.repository";
import {Event} from "./event.entity" 
import { TypeOrmModule } from '@nestjs/typeorm';
//import { Category } from 'src/entities/categories.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event])
  ],
  providers: [EventService, EventRepository],
  controllers: [EventsController]
})
export class EventModule {}