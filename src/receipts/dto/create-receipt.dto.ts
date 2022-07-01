import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReceiptDTO {
  @IsNotEmpty({ message: 'A descrição não pode estar em branco.' })
  @IsString()
  description: string;

  @IsNotEmpty({ message: 'O valor não pode estar em branco.' })
  @IsNumber()
  value: number;

  @IsString()
  date: string;
}
