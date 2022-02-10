import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesService } from './expenses.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Query } from 'mongoose';
import { ExpenseDoc, expensesArray, mockExpense } from './test.setup';
import { createMock } from '@golevelup/ts-jest';
import { ExpenseCategory } from './schema/expense-category.enum';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ExpensesService', () => {
  let service: ExpensesService;
  let expenseModel: Model<ExpenseDoc>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        {
          provide: getModelToken('Expense'),
          useValue: {},
        },
      ],
    }).compile();

    expenseModel = module.get<Model<ExpenseDoc>>(getModelToken('Expense'));
    service = module.get<ExpensesService>(ExpensesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new expense', async () => {
    const expense = mockExpense();
    jest.spyOn(service, 'createExpense').mockResolvedValue(expense);

    const newExpense = await service.createExpense({
      description: expense.description,
      value: expense.value,
      date: expense.date,
    });

    expect(newExpense).toEqual(expense);
    expect(service.createExpense).toHaveBeenCalled();
    expect(service.createExpense).not.toThrow();
    //default category if not provided
    expect(newExpense.category).toEqual(ExpenseCategory.Others);
  });

  it('should fail to create expense if it has same description on same month', async () => {
    const expense = mockExpense();

    jest
      .spyOn(service, 'createExpense')
      .mockRejectedValue(
        new ConflictException(
          'Já existe uma receita com esta descrição cadastrada no mês vigente.',
        ),
      );

    const failedExpense = service.createExpense({
      description: expense.description,
      value: expense.value,
      date: expense.date,
    });

    expect(service.createExpense).toHaveBeenCalled();
    await expect(failedExpense).rejects.toThrow(
      new ConflictException(
        'Já existe uma receita com esta descrição cadastrada no mês vigente.',
      ),
    );
  });

  it('should find all expenses', async () => {
    jest.spyOn(service, 'findAllExpenses').mockResolvedValue(expensesArray);

    const allExpenses = await service.findAllExpenses();

    expect(allExpenses).toEqual(expensesArray);
  });

  it('should find all expenses that match searched description', async () => {
    jest
      .spyOn(service, 'findAllExpenses')
      .mockResolvedValue(
        expensesArray.filter(
          (ex) => ex.description === 'parangaricotirimirruaro',
        ),
      );

    const expensesFiltered = await service.findAllExpenses(
      'parangaricotirimirruaro',
    );

    expect(expensesFiltered).toEqual([expensesArray[1]]);
  });

  it('should find expense by ID', async () => {
    const mockExp = mockExpense();
    jest.spyOn(service, 'findExpenseByID').mockResolvedValue(mockExp);

    const expense = await service.findExpenseByID('umdoistres');

    expect(expense).toBeDefined();
    expect(service.findExpenseByID).toHaveBeenCalled();
    expect(expense.id).toEqual(mockExp.id);
  });

  it('should throw if expense not found', async () => {
    jest
      .spyOn(service, 'findExpenseByID')
      .mockRejectedValue(
        new NotFoundException('Não foi encontrada uma despesa com este ID.'),
      );

    await expect(service.findExpenseByID('999')).rejects.toThrow(
      new NotFoundException('Não foi encontrada uma despesa com este ID.'),
    );
    expect(service.findExpenseByID).toHaveBeenCalled();
  });
});
