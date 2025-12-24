import { Event } from "src/modules/event/entities/event.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  name: "catgories",
})
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 50 })
  name: string;

  //Event N:1 Category
  @OneToMany(() => Event, (event) => event.category)
  envents: Event[];
}
