import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthPayload } from './types/auth-payload';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<AuthPayload> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Get('/ping')
  ping() {
    return this.authService.ping();
  }
}
