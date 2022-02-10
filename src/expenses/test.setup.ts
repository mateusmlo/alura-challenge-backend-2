import { DateTime } from 'luxon';
import { Document } from 'mongoose';
import { ExpenseCategory } from './schema/expense-category.enum';
import { Expense } from './schema/expense.schema';

export interface ExpenseDoc extends Document {
  description: string;
  value: number;
  date: Date;
  category: ExpenseCategory;
}

export const mockExpense = (
  description = 'despesa teste',
  id = 'umdoistres',
  value = 199,
  date = DateTime.fromObject({ day: 1, year: 2022, month: 2 }).toJSDate(),
  category = ExpenseCategory.Others,
): Expense & { _id: any } =>
  ({
    description,
    id,
    value,
    date,
    category,
  } as Expense & { _id: any });

export const mockExpenseDoc = (
  mock?: Partial<Expense>,
): Partial<ExpenseDoc> => ({
  description: mock?.description || 'despesa teste',
  _id: mock?.id || 'umdoistres',
  value: mock?.value || 99.99,
  category: mock?.category || ExpenseCategory.Others,
});

export const expensesArray = [
  mockExpense(),
  mockExpense(
    'parangaricotirimirruaro',
    'quatrocinco',
    50.99,
    DateTime.fromObject({ day: 1, year: 2022, month: 2 }).toJSDate(),
    ExpenseCategory.Food,
  ),
];

export const expensesDocArray = [
  mockExpenseDoc(),
  mockExpenseDoc({ description: 'despesa teste', id: 'new id', value: 49.99 }),
  mockExpenseDoc({
    description: 'despesa teste 2',
    id: 'aaa',
    category: ExpenseCategory.Education,
  }),
];
