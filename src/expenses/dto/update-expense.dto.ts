import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ExpenseCategory } from '../schema/expense-category.enum';

export class UpdateExpenseDto {
  @IsOptional()
  @IsNotEmpty({ message: 'A descrição não pode estar em branco.' })
  @IsString()
  description: string;

  @IsOptional()
  @IsNotEmpty({ message: 'O valor não pode estar em branco.' })
  @IsNumber()
  value: number;

  @IsOptional()
  @IsDate({ message: 'Formato de data inválido' })
  date: Date;

  @IsOptional()
  @IsEnum(ExpenseCategory, { message: 'Categoria inválida.' })
  category?: ExpenseCategory = ExpenseCategory.Others;
}
