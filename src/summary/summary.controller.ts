import { Controller, Get, Param } from '@nestjs/common';
import { Summary, SummaryService } from './summary.service';

@Controller('summary')
export class SummaryController {
  constructor(private summaryService: SummaryService) {}

  @Get('/:y/:m')
  getMonthSummary(
    @Param('y') year: number,
    @Param('m') month: number,
  ): Promise<Summary> {

    return this.summaryService.getMonthSummary(year, month);
  }
}
