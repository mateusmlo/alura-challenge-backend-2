import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/users/decorators/get-user.decorator';
import { UserDto } from 'src/users/dto/user.dto';
import { CreateReceiptDTO } from './dto/create-receipt.dto';
import { UpdateReceiptDTO } from './dto/update-receipt.dto';
import { ReceiptsService } from './receipts.service';
import { Receipt } from './schema/receipt.schema';

@UseGuards(JwtAuthGuard)
@Controller('receipts')
export class ReceiptsController {
  constructor(private receiptsService: ReceiptsService) {}

  @Post()
  createReceipt(
    @Body() createReceiptDto: CreateReceiptDTO,
    @CurrentUser() user: UserDto,
  ): Promise<Receipt> {
    return this.receiptsService.createReceipt(createReceiptDto, user);
  }

  @Get()
  findAllReceipts(
    @Query('descricao') search: string,
    @CurrentUser() user: UserDto,
  ): Promise<Receipt[]> {
    return this.receiptsService.findAllReceipts(user, search);
  }

  @Get('/:id')
  getReceiptByID(@Param('id') id: string): Promise<Receipt> {
    return this.receiptsService.findReceiptByID(id);
  }

  @Get('/:y/:m')
  getReceiptsByMonth(
    @Param('y') year: number,
    @Param('m') month: number,
    @CurrentUser() user: UserDto,
  ): Promise<Receipt[]> {
    return this.receiptsService.findReceiptsByMonth(year, month, user);
  }

  @Delete('/:id')
  deleteReceipt(@Param('id') id: string): Promise<number> {
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
