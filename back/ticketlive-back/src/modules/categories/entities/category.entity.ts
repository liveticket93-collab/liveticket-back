import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  name: "catgories",
})
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 50 })
  name: string;
}
