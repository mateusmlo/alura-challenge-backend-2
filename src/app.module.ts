import { Module } from '@nestjs/common';

import { ReceiptsModule } from './receipts/receipts.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpensesModule } from './expenses/expenses.module';
import { SummaryModule } from './summary/summary.module';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { jwtEnvs, refreshEnvs } from './config/jwt.env';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { RedisConfig } from './config/redis.config';
import { MongoConfig } from './config/mongo.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [jwtEnvs, refreshEnvs],
      isGlobal: true,
      expandVariables: true,
    }),
    ReceiptsModule,
    ExpensesModule,
    MongooseModule.forRootAsync({
      useClass: MongoConfig,
    }),
    RedisModule.forRootAsync({
      useClass: RedisConfig,
    }),
    SummaryModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
