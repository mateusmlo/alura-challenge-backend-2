import { Module } from '@nestjs/common';

import { ReceiptsModule } from './receipts/receipts.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { dbConfig } from './config/db.config';
import { ExpensesModule } from './expenses/expenses.module';
import { SummaryModule } from './summary/summary.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ReceiptsModule,
    ExpensesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig],
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('uri'),
        retryAttempts: 5,
        retryDelay: 1000,
        autoCreate: true,
      }),
      inject: [ConfigService],
    }),
    SummaryModule,
    UserModule,
  ],
})
export class AppModule {}
