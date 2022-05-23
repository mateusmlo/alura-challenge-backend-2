import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserDto } from 'src/users/dto/user.dto';
import { UserService } from 'src/users/user.service';
import { JWTPayload } from '../types/jwt-payload';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      secretOrKey: configService.get<string>('secret'),
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(req: Request, payload: JWTPayload): Promise<UserDto> {
    const token = req.headers.authorization;
    const { email, sub } = payload;
    const user = await this.userService.findOne(email);

    if (!user) throw new UnauthorizedException('Invalid token.');

    return {
      user_id: sub,
      email: user.email,
      token: token,
    };
  }
}
