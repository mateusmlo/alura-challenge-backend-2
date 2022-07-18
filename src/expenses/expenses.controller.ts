import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './schema/expense.schema';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/users/decorators/get-user.decorator';
import { UserDto } from 'src/users/dto/user.dto';

@Controller('expenses')
@ApiTags('expenses')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @ApiCreatedResponse({
    type: Expense,
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedException,
  })
  @Post()
  create(
    @Body() createExpenseDto: CreateExpenseDto,
    @CurrentUser() user: UserDto,
  ): Promise<Expense> {
    return this.expensesService.createExpense(createExpenseDto, user);
  }

  @Get()
  findAll(
    @Query('descricao') search: string,
    @CurrentUser() user: UserDto,
  ): Promise<Expense[]> {
    return this.expensesService.findAllExpenses(user, search);
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
  getExpensesByMonth(
    @Param('y') year: number,
    @Param('m') month: number,
    @CurrentUser() user: UserDto,
  ): Promise<Expense[]> {
    return this.expensesService.findExpensesByMonth(year, month, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<number> {
    return this.expensesService.deleteExpense(id);
  }
}
