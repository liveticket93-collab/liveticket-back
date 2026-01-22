import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("subscribers")
export class Subscriber {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255, unique: true })
  email: string;

  @CreateDateColumn({ name: "subscribed_at" })
  subscribedAt: Date;
}
