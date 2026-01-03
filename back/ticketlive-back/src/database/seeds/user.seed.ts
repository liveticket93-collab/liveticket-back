import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "../../modules/users/entities/users.entity";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserSeed {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async run() {
    console.log("Seeding users...");

    const usersData: Partial<User>[] = [
      {
        email: "admin@example.com",
        password: "admin123",
        name: "Admin User",
        birthday: new Date("1990-01-01"),
        isAdmin: true,
      },
      {
        email: "johndoe@example.com",
        password: "123456",
        name: "John Doe",
        birthday: new Date("1995-05-15"),
        isAdmin: false,
      },
      {
        email: "janedoe@example.com",
        password: "123456",
        name: "Jane Doe",
        birthday: new Date("1997-08-20"),
        isAdmin: false,
      },
    ];

    for (const userData of usersData) {
      const existingUser = await this.userRepository.findOneBy({
        email: userData.email,
      });

      if (!existingUser) {
        // Hasheamos la contraseña antes de guardar
        const hashedPassword = await bcrypt.hash(userData.password!, 10);
        const user = this.userRepository.create({
          ...userData,
          password: hashedPassword,
        });

        await this.userRepository.save(user);
        console.log(`User ${user.email} created`);
      } else {
        console.log(`User ${userData.email} already exists`);
      }
    }

    console.log("Users seeding finished!");
  }
}
