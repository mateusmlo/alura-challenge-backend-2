import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DateTime } from 'luxon';
import { Model } from 'mongoose';
import { UserDto } from 'src/users/dto/user.dto';
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

  async createExpense(createExpenseDto: CreateExpenseDto, user: UserDto) {
    const dateTime = DateTime.fromFormat(createExpenseDto.date, 'dd-L-yyyy');

    createExpenseDto.date = dateTime.toString();

    const requestDateMonthStart = dateTime.startOf('month');

    const requestDateMonthEnd = dateTime.endOf('month');

    const isDescriptionDuped = await this.expenseModel.findOne({
      description: createExpenseDto.description,
      date: {
        $gte: requestDateMonthStart,
        $lte: requestDateMonthEnd,
      },
      user: user.user_id,
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

    const newExpense = await this.expenseModel.create({
      ...createExpenseDto,
      user: user.user_id,
    });

    return newExpense;
  }

  async findAllExpenses(user: UserDto, search?: string): Promise<Expense[]> {
    if (search) {
      return this.expenseModel.find({
        description: { $regex: search, $options: 'i' },
        user: user.user_id,
      });
    }

    return this.expenseModel.find({ user: user.user_id });
  }

  async findExpenseByID(id: string): Promise<Expense> {
    const expense = await this.expenseModel.findById(id);

    if (!expense)
      throw new NotFoundException(
        'Não foi encontrada uma despesa com este ID.',
      );

    return expense;
  }

  async findExpensesByMonth(
    year: number,
    month: number,
    user: UserDto,
  ): Promise<Expense[]> {
    return this.expenseModel.find({
      date: {
        $gte: DateTime.fromObject({ year, month }),
        $lte: DateTime.fromObject({ year, month }).endOf('month'),
      },
      user: user.user_id,
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

    if (ExpenseCategory[updateExpenseDto.category] === undefined) {
      throw new BadRequestException('Categoria inválida.');
    }

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

    Object.assign(expense, updateExpenseDto);

    try {
      await this.expenseModel.updateOne(expense);
      return expense;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async totalExpenses(
    year: number,
    month: number,
    user: UserDto,
  ): Promise<any[]> {
    return this.expenseModel.aggregate([
      {
        $match: {
          date: {
            $gte: DateTime.fromObject({ year, month }),
            $lte: DateTime.fromObject({ year, month }).endOf('month'),
          },
          user: user.user_id,
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
