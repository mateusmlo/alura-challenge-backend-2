import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/user/schema/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private userModel: Model<User>,
    private configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get<string>(
        'jwtConstants.accessTokenConstants.secret',
      ),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username });

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
