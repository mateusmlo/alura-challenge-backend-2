import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/users/decorators/get-user.decorator';
import { UserDto } from 'src/users/dto/user.dto';
import { Summary, SummaryService } from './summary.service';

@UseGuards(JwtAuthGuard)
@Controller('summary')
export class SummaryController {
  constructor(private summaryService: SummaryService) {}

  @Get('/:y/:m')
  getMonthSummary(
    @Param('y') year: number,
    @Param('m') month: number,
    @CurrentUser() user: UserDto,
  ): Promise<Summary> {
    return this.summaryService.getMonthSummary(year, month, user);
  }
}
