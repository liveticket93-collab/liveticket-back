import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateGoogleUser(googleUser: {
    googleId: string;
    email: string;
    name: string;
  }) {
    const { googleId, email, name } = googleUser;

    let user = await this.usersService.findByGoogleId(googleId);

    if (!user) {
      user = await this.usersService.createFromGoogle({
        googleId,
        email,
        name,
        isAdmin: false,
      });
    }

    return user;
  }
}
