import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MockType } from '../common/mocks/mock.type';
import { ExpensesService } from './expenses.service';
import { Expense } from './schema/expense.schema';
import { expenseStub, vUserDto } from './stubs/expense.stub';
import { Model } from 'mongoose';
import { modelMock } from '../common/mocks/model.mock';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseCategory } from './schema/expense-category.enum';
import { UserDto } from '../users/dto/user.dto';

describe('ExpensesService', () => {
  let testExpense: Expense;
  let service: ExpensesService;
  let model: MockType<Model<Expense>>;
  let userDto: UserDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        {
          provide: getModelToken(Expense.name),
          useFactory: modelMock,
        },
      ],
    }).compile();

    userDto = vUserDto();
    testExpense = expenseStub();
    service = module.get<ExpensesService>(ExpensesService);
    model = module.get(getModelToken(Expense.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(model).toBeDefined();
  });

  describe('createExpense', () => {
    let createExpenseDto: CreateExpenseDto;

    beforeEach(() => {
      createExpenseDto = {
        description: testExpense.description,
        value: testExpense.value,
        date: testExpense.date.toString(),
        category: testExpense.category,
      };
    });

    it('should call expenseModel and return new expense if no dupes found', async () => {
      model.findOne.mockReturnValue(null);
      model.create.mockReturnValue(testExpense);

      const newExpense = await service.createExpense(createExpenseDto, userDto);

      expect(newExpense).toEqual(testExpense);
    });

    it('should throw if duped expense', async () => {
      model.findOne.mockReturnValue(testExpense);

      await expect(
        service.createExpense(createExpenseDto, userDto),
      ).rejects.toThrowError(
        new ConflictException(
          'Já existe uma receita com esta descrição cadastrada no mês vigente.',
        ),
      );
    });
  });

  describe('findAllExpenses', () => {
    it('should return all expenses owned by a user', async () => {
      const allExpenses = [testExpense];
      model.find.mockReturnValue(allExpenses);

      await expect(service.findAllExpenses(userDto, 'test')).resolves.toEqual(
        allExpenses,
      );
    });
  });

  describe('findExpenseByID', () => {
    it('should find and return an expense by ID', async () => {
      model.findById.mockReturnValue(testExpense);

      await expect(service.findExpenseByID('1')).resolves.toEqual(testExpense);
    });

    it('should throw if expense not found', async () => {
      model.findById.mockReturnValue(null);

      await expect(service.findExpenseByID('999')).rejects.toThrowError(
        new NotFoundException('Não foi encontrada uma despesa com este ID.'),
      );
    });
  });

  describe('findRecepitsByMonth', () => {
    it('should return receipts created in provided period', async () => {
      model.find.mockReturnValue([testExpense]);

      await expect(
        service.findExpensesByMonth(2000, 1, userDto),
      ).resolves.toEqual([testExpense]);
    });
  });

  describe('deleteExpense', () => {
    it('should return a count of deleted expenses if succesful', async () => {
      model.findById.mockReturnValue(testExpense);
      model.deleteOne.mockReturnValue({ deletedCount: 1 });

      await expect(service.deleteExpense('1')).resolves.toEqual(1);
    });

    it('should throw if expense to delete not found', async () => {
      model.findById.mockReturnValue(null);
      model.deleteOne.mockReturnValue({ deleteCount: 0 });

      await expect(service.deleteExpense('1')).rejects.toThrowError(
        new NotFoundException('Não foi encontrada uma despesa com este ID.'),
      );
    });
  });

  describe('updateExpense', () => {
    let updateExpenseDto: UpdateExpenseDto;

    beforeEach(() => {
      updateExpenseDto = {
        date: new Date(2001),
        category: ExpenseCategory.Food,
        description: 'update test',
      };
    });

    it('should update expense and be different from original', async () => {
      const expenseBeforeUpdate: Expense = { ...testExpense };
      model.findById.mockReturnValue(testExpense);
      model.updateOne.mockReturnValue(
        Object.assign(testExpense, updateExpenseDto),
      );

      await expect(
        service.updateExpense('1', updateExpenseDto),
      ).resolves.not.toEqual(expenseBeforeUpdate);
    });
  });

  describe('totalExpenses', () => {
    it('should return the sum of all expenses for a given month', async () => {
      model.aggregate.mockReturnValue({ total: 100 });

      await expect(service.totalExpenses(2000, 1, userDto)).resolves.toEqual({
        total: 100,
      });
    });
  });
});
