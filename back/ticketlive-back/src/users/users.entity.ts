import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true, nullable: true })
  googleId?: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ type: "varchar", length: "60", nullable: true })
  password?: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ type: "date", nullable: true })
  birthday: Date;

  @Column({ type: "varchar", nullable: true })
  dni: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
