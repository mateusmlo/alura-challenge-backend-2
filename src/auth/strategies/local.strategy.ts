import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserDto } from 'src/users/dto/user.dto';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<UserDto> {
    const user = await this.authService.validateUser(email, password);

    return {
      user_id: user['_id'].toString(),
      email: user.email,
    };
  }
}
