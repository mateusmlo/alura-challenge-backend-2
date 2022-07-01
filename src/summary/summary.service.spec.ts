import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesService } from '../expenses/expenses.service';
import { expenseStub, vUserDto } from '../expenses/stubs/expense.stub';
import { ReceiptsService } from '../receipts/receipts.service';
import { Summary, SummaryService } from './summary.service';

describe('SummaryService', () => {
  let summaryService: SummaryService;
  let expensesService: ExpensesService;
  let receiptsService: ReceiptsService;
  const summary: Summary = {
    totalExpenses: 100,
    totalReceipts: 100,
    profit: 0,
    expensesByCategory: {
      Unplanned: 123,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SummaryService,
        {
          provide: ReceiptsService,
          useValue: {
            totalReceipts: jest.fn(() => [{ total: 100 }]),
          },
        },
        {
          provide: ExpensesService,
          useValue: {
            totalExpenses: jest.fn(() => [{ total: 100 }]),
            findExpensesByMonth: jest.fn(() => [expenseStub()]),
          },
        },
      ],
    }).compile();

    summaryService = module.get<SummaryService>(SummaryService);
    expensesService = module.get<ExpensesService>(ExpensesService);
    receiptsService = module.get<ReceiptsService>(ReceiptsService);
  });

  it('should be defined', () => {
    expect(summaryService).toBeDefined();
    expect(expensesService).toBeDefined();
    expect(receiptsService).toBeDefined();
  });

  describe('getMonthSummary', () => {
    it('should return an obj w/ the sum of all expenses, receipts, and expenses total by category', async () => {
      await expect(
        summaryService.getMonthSummary(2000, 1, vUserDto()),
      ).resolves.toEqual(summary);
    });
  });
});
