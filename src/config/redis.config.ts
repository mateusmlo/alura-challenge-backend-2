import { Injectable, Logger } from '@nestjs/common';
import {
  RedisModuleOptions,
  RedisOptionsFactory,
} from '@liaoliaots/nestjs-redis';
import { ConfigService } from '@nestjs/config';

const logger = new Logger();

@Injectable()
export class RedisConfig implements RedisOptionsFactory {
  constructor(private configService: ConfigService) {}

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
        onClientCreated: (client: any) => {
          client.on('error', (err: Error) => {
            logger.error(
              `❌ Não é possível se conectar ao Redis; o servidor pode estar offline.`,
              err.message,
            );
          });
        },
      },
    };
  }
}
