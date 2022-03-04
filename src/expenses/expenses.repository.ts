import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DateTime } from 'luxon';
import { Model } from 'mongoose';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { Expense } from './schema/expense.schema';

@Injectable()
export class ExpenseRepository {
  constructor(@InjectModel('Expense') private expenseModel: Model<Expense>) {}

  async findOneBy(query: Record<string, unknown> = {}): Promise<Expense> {
    return await this.expenseModel.findOne({ ...query });
  }

  async createExpense(createExpenseDto: CreateExpenseDto): Promise<Expense> {
    return this.expenseModel.create(createExpenseDto);
  }

  async findManyBy(query: Record<string, unknown> = {}): Promise<Expense[]> {
    return await this.expenseModel.find({ ...query });
  }

  async findByID(id: string): Promise<Expense> {
    return await this.expenseModel.findById(id);
  }

  async deleteExpense(id: string): Promise<number> {
    return (await this.expenseModel.deleteOne({ _id: id })).deletedCount;
  }

  async save(doc: Expense): Promise<Expense> {
    return await new this.expenseModel(doc).save();
  }

  async getTotalExpenses(year: number, month: number) {
    return this.expenseModel.aggregate([
      {
        $match: {
          date: {
            $gte: DateTime.fromObject({ year, month }),
            $lte: DateTime.fromObject({ year, month }).endOf('month'),
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: '$value',
          },
        },
      },
    ]);
  }
}
