import mongoose from 'mongoose';
import { UserDto } from '../../users/dto/user.dto';
import { User } from '../../users/schema/user.schema';
import { ExpenseCategory } from '../schema/expense-category.enum';
import { Expense } from '../schema/expense.schema';

const userId = new mongoose.Types.ObjectId().toString();

export const expenseStub = (): Expense => {
  return {
    description: 'test',
    value: 123,
    date: new Date(2000),
    category: ExpenseCategory.Unplanned,
    user: userId as unknown as User,
  };
};

export const vUserDto = (): UserDto => ({
  email: 'test@test.com',
  user_id: userId,
});
