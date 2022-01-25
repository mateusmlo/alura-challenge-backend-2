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
import { Expense } from './schema/expense.schema';

@Injectable()
export class ExpensesService {
  private logger = new Logger('Expenses Service');
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
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

    const isDescriptionDuped = await this.expenseModel
      .findOne({
        description: `${createExpenseDto.description}`,
        date: {
          $gte: requestDateMonthStart,
          $lte: requestDateMonthEnd,
        },
      })
      .exec();

    if (isDescriptionDuped) {
      throw new ConflictException(
        'Já existe uma receita com esta descrição cadastrada no mês vigente.',
      );
    }

    const newExpense = new this.expenseModel(createExpenseDto);

    try {
      return newExpense.save();
    } catch (error) {
      this.logger.error(error);
    }
  }

  async findAllExpenses(): Promise<Expense[]> {
    return this.expenseModel.find().exec();
  }

  async findExpenseByID(id: string): Promise<Expense> {
    const expense = await this.expenseModel.findById(id).exec();

    if (!expense)
      throw new NotFoundException(
        'Não foi encontrada uma despesa com este ID.',
      );

    return expense;
  }

  async deleteExpense(id: string): Promise<Expense> {
    const expense = await this.findExpenseByID(id);

    if (!expense)
      throw new NotFoundException(
        'Não foi encontrada uma despesa com este ID.',
      );

    return await expense.deleteOne({ returnOriginal: true });
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

    expense.description = updateExpenseDto.description;
    expense.value = updateExpenseDto.value;

    try {
      return expense.save();
    } catch (error) {
      this.logger.error(error);
    }
  }
}
