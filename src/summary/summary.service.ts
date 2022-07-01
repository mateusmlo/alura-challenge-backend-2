import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/users/dto/user.dto';
import { ExpensesService } from '../expenses/expenses.service';
import { ExpenseCategory } from '../expenses/schema/expense-category.enum';
import { ReceiptsService } from '../receipts/receipts.service';

export type Summary = {
  totalReceipts: number;
  totalExpenses: number;
  profit: number;
  expensesByCategory: {
    [key in ExpenseCategory]?: number;
  };
};

@Injectable()
export class SummaryService {
  constructor(
    private receiptsService: ReceiptsService,
    private expensesService: ExpensesService,
  ) {}

  async getMonthSummary(
    year: number,
    month: number,
    user: UserDto,
  ): Promise<Summary> {
    const summary: Summary = {
      totalExpenses: 0,
      totalReceipts: 0,
      profit: 0,
      expensesByCategory: {},
    };

    const [totalReceipts] = await this.receiptsService.totalReceipts(
      year,
      month,
      user,
    );

    const [totalExpenses] = await this.expensesService.totalExpenses(
      year,
      month,
      user,
    );

    const expenses = await this.expensesService.findExpensesByMonth(
      year,
      month,
      user,
    );

    summary.totalExpenses = totalExpenses.total;
    summary.totalReceipts = totalReceipts.total;

    expenses.reduce((prev, exp) => {
      const { category, value } = exp;

      prev[category] ? (prev[category] += value) : (prev[category] = value);

      return (summary.expensesByCategory = { ...prev });
    }, {} as { [key in ExpenseCategory]: number });

    //essa subtração pode retornar casas decimais em excesso apesar de trabalharmos apenas com numeros x.xx devido a forma com que o JS trata floats, sendo necessário então passar um toFixed
    summary.profit = parseFloat(
      (summary.totalReceipts - summary.totalExpenses).toFixed(2),
    );

    return summary;
  }
}
