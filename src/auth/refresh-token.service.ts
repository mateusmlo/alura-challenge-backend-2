import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RefreshTokenService {
  public logger = new Logger();

  constructor(@InjectRedis('jwt') private readonly redis: Redis) {}

  async ping() {
    return await this.redis.ping('BORA');
  }

  async validateRefreshToken(token: string, sub: string) {
    const secureTkn = await this.getTokenHash(sub);

    await this.compareTokens(token, secureTkn);

    return true;
  }

  async getTokenHash(sub: string) {
    const tkn = await this.redis.get(sub);

    if (tkn === null) throw new UnauthorizedException('Invalid token');

    return tkn;
  }

  async saveRefreshToken(
    expiresIn: number | string,
    sub: any,
    tkn: string,
  ): Promise<'OK' | null> {
    const refreshTkn = await bcrypt.hash(tkn, 12);

    return await this.redis.set(sub, refreshTkn, 'ex', expiresIn);
  }

  async deleteKey(sub: any): Promise<boolean> {
    const res = await this.redis.del(sub);

    if (res !== 1) throw new InternalServerErrorException();

    return true;
  }

  async compareTokens(tkn: string, secureTkn: string): Promise<boolean> {
    //splits 'Bearer ' portion then extracts the token
    const payload = tkn.split(' ');

    const isMatch = await bcrypt.compare(payload[1], secureTkn);

    if (!isMatch) throw new UnauthorizedException();

    return true;
  }
}
