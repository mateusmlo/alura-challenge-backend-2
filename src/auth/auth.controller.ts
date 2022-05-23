import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/users/decorators/get-user.decorator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { User } from 'src/users/schema/user.schema';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshGuard } from './guards/refresh-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signIn(@CurrentUser() user: UserDto) {
    return this.authService.signIn(user);
  }

  @UseGuards(RefreshGuard)
  @Post('refresh')
  issueRefreshToken(@CurrentUser() user: UserDto) {
    return this.authService.refreshAccessToken(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('ping')
  ping(@CurrentUser() user: User) {
    //console.log(user);

    return this.authService.ping();
  }
}
