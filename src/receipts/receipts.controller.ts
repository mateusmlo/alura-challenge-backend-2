import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateReceiptDTO } from './dto/create-receipt.dto';
import { UpdateReceiptDTO } from './dto/update-receipt.dto';
import { ReceiptsService } from './receipts.service';
import { Receipt } from './schema/receipt.schema';

@Controller('receipts')
export class ReceiptsController {
  constructor(private receiptsService: ReceiptsService) {}

  @Post()
  createReceipt(@Body() createReceiptDto: CreateReceiptDTO): Promise<Receipt> {
    return this.receiptsService.createReceipt(createReceiptDto);
  }

  @Get()
  findAllReceipts(@Query('descricao') search: string): Promise<Receipt[]> {
    return this.receiptsService.findAllReceipts(search);
  }

  @Get('/:id')
  getReceiptByID(@Param('id') id: string): Promise<Receipt> {
    return this.receiptsService.findReceiptByID(id);
  }

  @Get('/:y/:m')
  getReceiptsByMonth(
    @Param('y') year: number,
    @Param('m') month: number,
  ): Promise<Receipt[]> {
    return this.receiptsService.findReceiptsByMonth(year, month);
  }

  @Delete('/:id')
  deleteReceipt(@Param('id') id: string): Promise<Receipt> {
    return this.receiptsService.deleteReceipt(id);
  }

  @Put('/:id')
  updateReceipt(
    @Param('id') id: string,
    @Body() updateReceiptDto: UpdateReceiptDTO,
  ): Promise<Receipt> {
    return this.receiptsService.updateReceipt(id, updateReceiptDto);
  }
}
