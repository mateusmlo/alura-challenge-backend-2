import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/users/decorators/get-user.decorator';
import { User } from 'src/users/schema/user.schema';
import { Summary, SummaryService } from './summary.service';

@Controller('summary')
export class SummaryController {
  constructor(private summaryService: SummaryService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/:y/:m')
  getMonthSummary(
    @Param('y') year: number,
    @Param('m') month: number,
    @CurrentUser() user: User,
  ): Promise<Summary> {

    return this.summaryService.getMonthSummary(year, month);
  }
}
