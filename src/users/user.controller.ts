import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from './decorators/get-user.decorator';
import { User } from './schema/user.schema';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/whoami')
  whoAmI(@CurrentUser() user: User): User {
    return user;
  }
}
