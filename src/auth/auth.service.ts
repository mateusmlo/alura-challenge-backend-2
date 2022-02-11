import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { User } from 'src/user/schema/user.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  private accessJwtSignOptions: JwtSignOptions;

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.accessJwtSignOptions = {
      ...this.configService.get('jwtConstants.accessTokenConstants'),
    };
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userService.validateLogin(username, password);

    return user;
  }

  async login(user: User) {
    const payload = { id: user.id, username: user.username };

    return {
      accessToken: this.signToken(payload),
      sessionId: randomUUID(),
      userId: user.id,
    };
  }

  private signToken(payload: { id: number; username: string }): string {
    return this.jwtService.sign(payload, this.accessJwtSignOptions);
  }
}
