import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { User } from 'src/users/schema/user.schema';
import { ExpenseCategory } from '../schema/expense-category.enum';

export class CreateExpenseDto {
  @IsNotEmpty({ message: 'A descrição não pode estar em branco.' })
  @IsString()
  description: string;

  @IsNotEmpty({ message: 'O valor não pode estar em branco.' })
  @IsNumber()
  value: number;

  @IsDate({ message: 'Formato de data inválido' })
  date: Date;

  user: User;

  @IsOptional()
  @IsEnum(ExpenseCategory, { message: 'Categoria inválida.' })
  category?: ExpenseCategory = ExpenseCategory.Others;
}
