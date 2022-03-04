import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesService } from './expenses.service';
import {
  ExpenseDoc,
  expensesArray,
  mockExpense,
  mockExpenseDoc,
  mockExpenseRepository,
} from './test.setup';
import { ExpenseCategory } from './schema/expense-category.enum';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { DateTime } from 'luxon';
import { ExpenseRepository } from './expenses.repository';
import { CreateExpenseDto } from './dto/create-expense.dto';

describe('ExpensesService', () => {
  let service: ExpensesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        {
          provide: ExpenseRepository,
          useValue: mockExpenseRepository,
        },
      ],
    }).compile();

    service = module.get<ExpensesService>(ExpensesService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new expense', async () => {
    const mock = mockExpense('carro quebrou', 'umdoistres', 99.99);
    mockExpenseRepository.findOneBy.mockImplementationOnce(() => {
      Promise.resolve({
        _id: 'etc',
        description: 'a',
        value: 1,
        date: Date.now(),
      });
    });

    mockExpenseRepository.save.mockResolvedValueOnce(mock);

    const createExpenseDto: CreateExpenseDto = {
      description: 'carro quebrou',
      value: 99.99,
      date: mock.date,
    };

    const newExpense = await service.createExpense(createExpenseDto);

    expect(service.createExpense).not.toThrow();
    expect(mockExpenseRepository.findOneBy).toHaveBeenCalled();
    expect(newExpense.category).toEqual(ExpenseCategory.Others);
  });

  it('should fail to create expense if it has same description on same month', async () => {
    const expense = mockExpense();

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
