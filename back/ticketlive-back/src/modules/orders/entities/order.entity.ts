import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "orders" })
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  total: number;

  @Column()
  date: Date;

  @Column()
  status: string;
}
