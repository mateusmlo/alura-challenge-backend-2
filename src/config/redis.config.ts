import { Injectable, Logger } from '@nestjs/common';
import {
  RedisModuleOptions,
  RedisOptionsFactory,
} from '@liaoliaots/nestjs-redis';
import { ConfigService } from '@nestjs/config';
import IORedis from 'ioredis';

@Injectable()
export class RedisConfig implements RedisOptionsFactory {
  constructor(private configService: ConfigService) {}
  private logger = new Logger(RedisConfig.name);

  createRedisOptions(): RedisModuleOptions {
    return {
      readyLog: true,
      closeClient: true,
      config: {
        name: 'auth',
        namespace: 'jwt',
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        password: process.env.REDIS_PASS,
        db: parseInt(process.env.REDIS_DB),
        connectTimeout: parseInt(process.env.REDIS_TTL),
        disconnectTimeout: parseInt(process.env.REDIS_EXPIRE_TIME),
        enableReadyCheck: true,
        onClientCreated: (client: IORedis.Redis) => {
          client.on('error', (err: Error) => {
            this.logger.error(
              `❌ Não é possível se conectar ao Redis; o servidor pode estar offline.`,
              err.message,
            );
          });
        },
      },
    };
  }
}
