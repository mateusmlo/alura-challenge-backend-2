import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateExpenseDto {
  @IsNotEmpty({ message: 'A descrição não pode estar em branco.' })
  @IsString()
  description: string;

  @IsNotEmpty({ message: 'O valor não pode estar em branco.' })
  @IsNumber()
  value: number;

  @IsDate({ message: 'Formato de data inválido' })
  date: Date;
}
