import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DateTime } from 'luxon';
import { Model } from 'mongoose';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseCategory } from './schema/expense-category.enum';
import { Expense, ExpenseDocument } from './schema/expense.schema';

@Injectable()
export class ExpensesService {
  private logger = new Logger('Expenses Service');
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<ExpenseDocument>,
  ) {}

  async createExpense(createExpenseDto: CreateExpenseDto) {
    createExpenseDto.date = DateTime.fromFormat(
      createExpenseDto.date.toString(),
      'dd-L-yyyy',
    ).toJSDate();

    const requestDateMonthStart = DateTime.fromJSDate(
      createExpenseDto.date,
    ).startOf('month');
    const requestDateMonthEnd = DateTime.fromJSDate(
      createExpenseDto.date,
    ).endOf('month');

    const isDescriptionDuped = await this.expenseModel.findOne({
      description: `${createExpenseDto.description}`,
      date: {
        $gte: requestDateMonthStart,
        $lte: requestDateMonthEnd,
      },
    });

    if (isDescriptionDuped) {
      throw new ConflictException(
        'Já existe uma receita com esta descrição cadastrada no mês vigente.',
      );
    }

    if (createExpenseDto.category) {
      createExpenseDto.category = ExpenseCategory[createExpenseDto.category];
    } else {
      createExpenseDto.category = ExpenseCategory.Others;
    }

    const newExpense = await this.expenseModel.create(createExpenseDto);

    return newExpense;
  }

  async findAllExpenses(search: string): Promise<Expense[]> {
    if (search) {
      return this.expenseModel.find({
        description: { $regex: search, $options: 'i' },
      });
    }

    return this.expenseModel.find();
  }

  async findExpenseByID(id: string): Promise<Expense> {
    const expense = await this.expenseModel.findById(id);

    if (!expense)
      throw new NotFoundException(
        'Não foi encontrada uma despesa com este ID.',
      );

    return expense;
  }

  async findExpensesByMonth(year: number, month: number): Promise<Expense[]> {
    return this.expenseModel.find({
      date: {
        $gte: DateTime.fromObject({ year, month }),
        $lte: DateTime.fromObject({ year, month }).endOf('month'),
      },
    });
  }

  async deleteExpense(id: string): Promise<number> {
    const expense = await this.findExpenseByID(id);

    if (!expense)
      throw new NotFoundException(
        'Não foi encontrada uma despesa com este ID.',
      );

    return (await this.expenseModel.deleteOne(expense)).deletedCount;
  }

  async updateExpense(
    id: string,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    const expense = await this.findExpenseByID(id);

    //* caso uma data seja passada para atualizar, não pode ser de uma já existente no mês
    if (updateExpenseDto.date) {
      updateExpenseDto.date = DateTime.fromFormat(
        updateExpenseDto.date.toString(),
        'dd-L-yyyy',
      ).toJSDate();

      const requestDateMonthStart = DateTime.fromJSDate(
        updateExpenseDto.date,
      ).startOf('month');
      const requestDateMonthEnd = DateTime.fromJSDate(
        updateExpenseDto.date,
      ).endOf('month');

      if (
        DateTime.fromJSDate(expense.date) >= requestDateMonthStart &&
        DateTime.fromJSDate(expense.date) <= requestDateMonthEnd
      ) {
        throw new ConflictException(
          'Já existe uma receita com esta descrição cadastrada no mês vigente.',
        );
      }

      expense.date = updateExpenseDto.date;
    }

    if (updateExpenseDto.category) {
      updateExpenseDto.category = ExpenseCategory[updateExpenseDto.category];
    }

    Object.assign(expense, updateExpenseDto);

    try {
      await this.expenseModel.updateOne(expense);
      return expense;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async totalExpenses(year: number, month: number) {
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
