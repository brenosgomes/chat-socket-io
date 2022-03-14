import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async loginAdmin(admin) {
    const payload = { sub: admin._id, email: admin.email };

    return {
      id: admin._id,
      name: admin.name,
      token: this.jwtService.sign(payload, {
        privateKey: process.env.SECRET_KEY,
        expiresIn: '36000s',
      }),
    };
  }

  async validateAdmin(email: string, password: string) {
    let user: any;
    try {
      user = await this.userService.findByLogin(email, password);
    } catch (err) {
      return null;
    }

    return user;
  }
}
