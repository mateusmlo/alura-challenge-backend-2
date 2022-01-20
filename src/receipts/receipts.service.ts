import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReceiptDTO } from './dto/create-receipt.dto';
import { Receipt } from './schema/receipt.schema';
import { DateTime } from 'luxon';
import { UpdateReceiptDTO } from './dto/update-receipt.dto';

@Injectable()
export class ReceiptsService {
  private logger = new Logger('Receipts Service');
  constructor(
    @InjectModel(Receipt.name) private receiptModel: Model<Receipt>,
  ) {}

  async createReceipt(createReceiptDto: CreateReceiptDTO): Promise<Receipt> {
    createReceiptDto.date = DateTime.fromFormat(
      createReceiptDto.date.toString(),
      'dd-L-yyyy',
    ).toJSDate();

    const requestDateMonthStart = DateTime.fromJSDate(
      createReceiptDto.date,
    ).startOf('month');
    const requestDateMonthEnd = DateTime.fromJSDate(
      createReceiptDto.date,
    ).endOf('month');

    const isDescriptionDuped = await this.receiptModel
      .findOne({
        description: `${createReceiptDto.description}`,
        data: {
          $gte: requestDateMonthStart,
          $lte: requestDateMonthEnd,
        },
      })
      .exec();

    if (isDescriptionDuped) {
      throw new ConflictException(
        'Já existe uma receita com esta descrição cadastrada no mês vigente.',
      );
    }

    const newReceipt = new this.receiptModel(createReceiptDto);

    try {
      return newReceipt.save();
    } catch (error) {
      this.logger.error(error);
    }
  }

  async findAllReceipts(): Promise<Receipt[]> {
    return this.receiptModel.find().exec();
  }

  async findReceiptByID(id: string): Promise<Receipt> {
    const receipt = await this.receiptModel.findById(id).exec();

    if (!receipt)
      throw new NotFoundException(
        'Não foi encontrada uma receita com este ID.',
      );

    return receipt;
  }

  async deleteReceipt(id: string): Promise<number> {
    const receipt = await this.findReceiptByID(id);

    if (!receipt)
      throw new NotFoundException(
        'Não foi encontrada uma receita com este ID.',
      );

    return (await this.receiptModel.deleteOne()).deletedCount;
  }

  async updateReceipt(
    id: string,
    updateReceiptDto: UpdateReceiptDTO,
  ): Promise<Receipt> {
    const receipt = await this.findReceiptByID(id);

    //* caso uma data seja passada para atualizar, não pode ser de uma já existente no mês
    if (updateReceiptDto.date) {
      updateReceiptDto.date = DateTime.fromFormat(
        updateReceiptDto.date.toString(),
        'dd-L-yyyy',
      ).toJSDate();

      const requestDateMonthStart = DateTime.fromJSDate(
        updateReceiptDto.date,
      ).startOf('month');
      const requestDateMonthEnd = DateTime.fromJSDate(
        updateReceiptDto.date,
      ).endOf('month');

      if (
        DateTime.fromJSDate(receipt.date) >= requestDateMonthStart &&
        DateTime.fromJSDate(receipt.date) <= requestDateMonthEnd
      ) {
        throw new ConflictException(
          'Já existe uma receita com esta descrição cadastrada no mês vigente.',
        );
      }

      receipt.date = updateReceiptDto.date;
    }

    receipt.description = updateReceiptDto.description;
    receipt.value = updateReceiptDto.value;

    try {
      return receipt.save();
    } catch (error) {
      this.logger.error(error);
    }
  }
}
