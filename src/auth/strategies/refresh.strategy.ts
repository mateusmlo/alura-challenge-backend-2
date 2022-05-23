import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserDto } from 'src/users/dto/user.dto';
import { UserService } from 'src/users/user.service';
import { RefreshTokenService } from '../refresh-token.service';
import { JWTPayload } from '../types/jwt-payload';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private refreshTokenService: RefreshTokenService,
  ) {
    super({
      secretOrKey: configService.get('refresh.secret'),
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JWTPayload): Promise<UserDto> {
    const token = req.headers.authorization;

    await this.refreshTokenService.validateRefreshToken(token, payload.sub);

    const user = await this.userService.findOne(payload.email);

    return {
      user_id: payload.sub,
      email: user.email,
    };
  }
}
