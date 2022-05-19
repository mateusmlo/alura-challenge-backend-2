import { ExpenseCategory } from '../schema/expense-category.enum';
import { Expense } from '../schema/expense.schema';
import { Types } from 'mongoose';

export const expenseStub = (): Expense => {
  return {
    _id: new Types.ObjectId('aaaaaaaaaaaa'),
    description: 'test',
    value: 123,
    date: new Date(2000),
    category: ExpenseCategory.Unplanned,
  };
};
