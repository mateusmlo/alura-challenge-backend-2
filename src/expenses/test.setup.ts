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

const testDate = DateTime.fromObject({
  day: 1,
  year: 2022,
  month: 2,
}).toJSDate();

export const mockExpenseRepository = {
  findDupedExpense: jest.fn(),
  createExpense: jest.fn(),
  findManyBy: jest.fn(),
  findOneBy: jest.fn(),
  deleteExpense: jest.fn().mockResolvedValue(1),
  save: jest.fn(),
  findByID: jest.fn(),
};

export const mockExpense = (
  description = 'despesa teste',
  id = 'umdoistres',
  value = 99.99,
  date = testDate,
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
  date: mock?.date || testDate,
});

export const expensesArray = [
  mockExpense(),
  mockExpense(
    'parangaricotirimirruaro',
    'quatrocinco',
    50.99,
    testDate,
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
