import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  findByGoogleId(googleId: string) {
    return this.findOne({ where: { googleId } });
  }

  findByEmail(email: string) {
    return this.findOne({ where: { email } });
  }
}
