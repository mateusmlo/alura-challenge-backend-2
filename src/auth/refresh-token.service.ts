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

  async validateRefreshToken(token: string, sub: number) {
    const secureTkn = await this.getToken(sub);

    await this.compareTokens(token, secureTkn);
    await this.deleteKey(sub);

    return true;
  }

  async getToken(sub: number) {
    const tkn = await this.redis.get(sub.toString());

    if (tkn === null) throw new UnauthorizedException();

    return tkn;
  }

  async saveRefreshToken(expiresIn: number | string, sub: number, tkn: string) {
    const refreshTkn = await bcrypt.hash(tkn, 12);

    return await this.redis.set(sub.toString(), refreshTkn, 'ex', expiresIn);
  }

  async deleteKey(sub: number) {
    const isRevoked = await this.redis.del(sub.toString());

    if (isRevoked !== 1) throw new InternalServerErrorException();

    return true;
  }

  async compareTokens(tkn: string, secureTkn: string) {
    //splits 'Bearer ' portion then extracts the token
    const payload = tkn.split(' ');

    const isMatch = await bcrypt.compare(payload[1], secureTkn);

    if (!isMatch) throw new UnauthorizedException();

    return true;
  }
}
