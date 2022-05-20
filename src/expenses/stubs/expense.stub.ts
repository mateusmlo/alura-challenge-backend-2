import { ExpenseCategory } from '../schema/expense-category.enum';
import { Expense } from '../schema/expense.schema';

export const expenseStub = (): Expense => {
  return {
    description: 'test',
    value: 123,
    date: new Date(2000),
    category: ExpenseCategory.Unplanned,
  };
};
