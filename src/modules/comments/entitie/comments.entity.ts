import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from "typeorm";

@Entity("comments")
export class Comment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  role?: string;

  @Column({ type: "text" })
  content: string;

  @Column({ type: "int" })
  rating: number; // 1-5

  @Column({ type: "text", nullable: true })
  image?: string; // avatar URL

  @Column({ type: "text", nullable: true })
  eventImage?: string; // URL final (Cloudinary/S3) o base64 si deciden así

  @Column({ type: "boolean", default: false })
  verified: boolean;

  @Column({ type: "varchar", length: 200, nullable: true })
  event?: string;

  @Index()
  @Column({ type: "boolean", default: true })
  visible: boolean; // para “aprobado/visible” en GET

  @CreateDateColumn()
  createdAt: Date;
}
