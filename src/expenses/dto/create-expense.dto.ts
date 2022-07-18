import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ExpenseCategory } from '../schema/expense-category.enum';

export class CreateExpenseDto {
  @ApiProperty({ example: 'parcela do carro' })
  @IsNotEmpty({ message: 'A descrição não pode estar em branco.' })
  @IsString()
  description: string;

  @ApiProperty({ example: 599.9 })
  @IsNotEmpty({ message: 'O valor não pode estar em branco.' })
  @IsNumber()
  value: number;

  @ApiProperty({ example: '01-01-2000' })
  @IsString()
  date: string;

  @ApiProperty({ required: false, example: 'transport' })
  @IsOptional()
  @IsEnum(ExpenseCategory, { message: 'Categoria inválida.' })
  category: ExpenseCategory = ExpenseCategory.Others;
}
