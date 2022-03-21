import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RefreshGuard } from 'src/auth/guards/refresh-auth.guard';
import { CurrentUser } from './decorators/get-user.decorator';
import { User } from './schema/user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(RefreshGuard)
  @Get('/whoami')
  whoAmI(@CurrentUser() user: User): User {
    return user;
  }
}
