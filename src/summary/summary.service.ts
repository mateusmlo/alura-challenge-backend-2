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

    const [totalReceipts] = await this.receiptsService.totalReceipts(
      year,
      month,
    );

    const [totalExpenses] = await this.expensesService.totalExpenses(
      year,
      month,
    );

    const expenses = await this.expensesService.findReceiptsByMonth(
      year,
      month,
    );

    summary.totalExpenses = totalExpenses.total;
    summary.totalReceipts = totalReceipts.total;

    expenses.reduce((prev, exp) => {
      const { category, value } = exp;

      prev[category] ? (prev[category] += value) : (prev[category] = value);

      return (summary.byCategory = { ...prev });
    }, {});

    summary.profit = parseFloat(
      (summary.totalReceipts - summary.totalExpenses).toFixed(2),
    );

    return summary;
  }
}
