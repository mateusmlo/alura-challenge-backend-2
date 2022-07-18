import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReceiptDTO } from './dto/create-receipt.dto';
import { Receipt, ReceiptDocument } from './schema/receipt.schema';
import { DateTime } from 'luxon';
import { UpdateReceiptDTO } from './dto/update-receipt.dto';
import { UserDto } from 'src/users/dto/user.dto';

@Injectable()
export class ReceiptsService {
  private logger = new Logger('Receipts Service');
  constructor(
    @InjectModel(Receipt.name) private receiptModel: Model<ReceiptDocument>,
  ) {}

  async createReceipt(
    createReceiptDto: CreateReceiptDTO,
    user: UserDto,
  ): Promise<Receipt> {
    const dateTime = DateTime.fromFormat(createReceiptDto.date, 'dd-L-yyyy');

    createReceiptDto.date = dateTime.toString();

    const requestDateMonthStart = dateTime.startOf('month');

    const requestDateMonthEnd = dateTime.endOf('month');

    const isDescriptionDuped = await this.receiptModel.findOne({
      description: createReceiptDto.description,
      date: {
        $gte: requestDateMonthStart,
        $lte: requestDateMonthEnd,
      },
      user: user.user_id,
    });

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

  async findAllReceipts(user: UserDto, search?: string): Promise<Receipt[]> {
    if (search) {
      return this.receiptModel.find({
        description: { $regex: search, $options: 'i' },
        user: user.user_id,
      });
    }

    return this.receiptModel.find({ user: user.user_id });
  }

  async findReceiptByID(id: string): Promise<Receipt> {
    const receipt = await this.receiptModel.findById(id).exec();

    if (!receipt)
      throw new NotFoundException(
        'Não foi encontrada uma receita com este ID.',
      );

    return receipt;
  }

  async findReceiptsByMonth(
    year: number,
    month: number,
    user: UserDto,
  ): Promise<Receipt[]> {
    return this.receiptModel.find({
      date: {
        $gte: DateTime.fromObject({ year, month }),
        $lte: DateTime.fromObject({ year, month }).endOf('month'),
      },
      user: user.user_id,
    });
  }

  async deleteReceipt(id: string): Promise<number> {
    const receipt = await this.findReceiptByID(id);

    if (!receipt)
      throw new NotFoundException(
        'Não foi encontrada uma receita com este ID.',
      );

    return (await this.receiptModel.deleteOne(receipt)).deletedCount;
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

    Object.assign(receipt, updateReceiptDto);

    try {
      await this.receiptModel.updateOne(receipt);
      return receipt;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async totalReceipts(year: number, month: number, user: UserDto) {
    return this.receiptModel.aggregate([
      {
        $match: {
          date: {
            $gte: DateTime.fromObject({ year, month }),
            $lte: DateTime.fromObject({ year, month }).endOf('month'),
          },
          user: user.user_id,
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: '$value',
          },
        },
      },
    ]);
  }
}
