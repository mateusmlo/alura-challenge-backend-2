import { Module } from '@nestjs/common';
import { ExpensesModule } from 'src/expenses/expenses.module';
import { ReceiptsModule } from 'src/receipts/receipts.module';
import { SummaryService } from './summary.service';
import { SummaryController } from './summary.controller';

@Module({
  imports: [ExpensesModule, ReceiptsModule],
  providers: [SummaryService],
  controllers: [SummaryController],
})
export class SummaryModule {}
