import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateReceiptDTO {
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
}
