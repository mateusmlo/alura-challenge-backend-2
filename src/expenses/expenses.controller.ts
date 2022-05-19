import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './schema/expense.schema';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  create(@Body() createExpenseDto: CreateExpenseDto): Promise<Expense> {
    return this.expensesService.createExpense(createExpenseDto);
  }

  @Get()
  findAll(@Query('descricao') search: string): Promise<Expense[]> {
    return this.expensesService.findAllExpenses(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Expense> {
    return this.expensesService.findExpenseByID(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    return this.expensesService.updateExpense(id, updateExpenseDto);
  }

  @Get('/:y/:m')
  getReceiptsByMonth(
    @Param('y') year: number,
    @Param('m') month: number,
  ): Promise<Expense[]> {
    return this.expensesService.findExpensesByMonth(year, month);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<number> {
    return this.expensesService.deleteExpense(id);
  }
}
