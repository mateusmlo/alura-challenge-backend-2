import { Injectable } from '@nestjs/common';
import { ExpensesService } from 'src/expenses/expenses.service';
import { ExpenseCategory } from 'src/expenses/schema/expense-category.enum';
import { Expense } from 'src/expenses/schema/expense.schema';
import { ReceiptsService } from 'src/receipts/receipts.service';

export type Summary = {
  totalReceipts: number;
  totalExpenses: number;
  profit: number;
  byCategory: {
    [key in ExpenseCategory]?: number;
  };
};

@Injectable()
export class SummaryService {
  constructor(
    private receiptsService: ReceiptsService,
    private expensesService: ExpensesService,
  ) {}

  async getMonthSummary(year: number, month: number): Promise<Summary> {
    const summary: Summary = {
      totalExpenses: 0,
      totalReceipts: 0,
      profit: 0,
      byCategory: {},
    };
    const receipts = await this.receiptsService.findReceiptsByMonth(
      year,
      month,
    );
    const expenses = await this.expensesService.findReceiptsByMonth(
      year,
      month,
    );

    summary.totalReceipts = receipts.reduce(
      (initialReceipt, currentReceipt) => {
        return initialReceipt + currentReceipt.value;
      },
      summary.totalReceipts,
    );

    summary.totalExpenses = expenses.reduce(
      (initialExpense, currentExpense) => {
        return initialExpense + currentExpense.value;
      },
      summary.totalExpenses,
    );

    /*     //!BROKEN soma das despesas por categoria
    expenses.map((expense) => {
      expenses.reduce((a, b) => {
        if (b.category === expense.category)
          summary.byCategory[expense.category] = a + b.value;

        return (summary.byCategory[expense.category] = expense.value);
      }, expense.value);
    }); */

    summary.profit = parseFloat(
      (summary.totalReceipts - summary.totalExpenses).toFixed(2),
    );

    return summary;
  }
}
