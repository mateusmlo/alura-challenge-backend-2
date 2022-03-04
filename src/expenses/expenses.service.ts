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
import { ExpenseRepository } from './expenses.repository';
import { ExpenseCategory } from './schema/expense-category.enum';
import { Expense } from './schema/expense.schema';

@Injectable()
export class ExpensesService {
  private logger = new Logger('Expenses Service');
  constructor(private expenseRepository: ExpenseRepository) {}

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

    const isDescriptionDuped = await this.expenseRepository.findOneBy({
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

    const newExpense = await this.expenseRepository.createExpense(
      createExpenseDto,
    );

    try {
      return this.expenseRepository.save(newExpense);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async findAllExpenses(search?: string): Promise<Expense[]> {
    if (search) {
      return this.expenseRepository.findManyBy({
        description: { $regex: search, $options: 'i' },
      });
    }

    return this.expenseRepository.findManyBy();
  }

  async findExpenseByID(id: string): Promise<Expense> {
    const expense = await this.expenseRepository.findByID(id);

    if (!expense)
      throw new NotFoundException(
        'Não foi encontrada uma despesa com este ID.',
      );

    return expense;
  }

  async findReceiptsByMonth(year: number, month: number): Promise<Expense[]> {
    return this.expenseRepository.findManyBy({
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

    return await this.expenseRepository.deleteExpense(id);
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
      return expense.save();
    } catch (error) {
      this.logger.error(error);
    }
  }

  async totalExpenses(year: number, month: number): Promise<any[]> {
    return this.expenseRepository.getTotalExpenses(year, month);
  }
}
