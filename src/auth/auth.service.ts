import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { User } from 'src/users/schema/user.schema';
import { UserService } from 'src/users/user.service';
import { RefreshTokenService } from './refresh-token.service';
import { AuthPayload } from './types/auth-payload';
import { JWTPayload } from './types/jwt-payload';

@Injectable()
export class AuthService {
  private refreshJwtSignOptions: JwtSignOptions;

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokenService,
    private configService: ConfigService,
  ) {
    this.refreshJwtSignOptions = {
      ...configService.get<JwtSignOptions>('refresh'),
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findOne(email);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      throw new UnauthorizedException(`Invalid credentials`);

    return user;
  }

  async ping() {
    return this.refreshTokenService.ping();
  }

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;

    const user = await this.userService.createUser({
      email,
      password,
    });

    return user;
  }

  async login(payload: UserDto): Promise<AuthPayload> {
    const jwtPayload: JWTPayload = {
      email: payload.email,
      sub: payload.user_id,
    };

    const accessToken = await this.jwtService.signAsync(jwtPayload);
    const refreshToken = await this.generateRefreshToken(jwtPayload);

    return {
      accessToken,
      refreshToken,
      userId: payload.user_id,
      email: payload.email,
    };
  }

  async generateRefreshToken(payload: JWTPayload): Promise<string> {
    try {
      const refreshToken = await this.jwtService.signAsync(
        payload,
        this.refreshJwtSignOptions,
      );

      await this.refreshTokenService.saveRefreshToken(
        this.refreshJwtSignOptions.expiresIn,
        payload.sub,
        refreshToken,
      );

      return refreshToken;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async logout(userId: string): Promise<boolean> {
    if (!userId) throw new BadRequestException('no user to logout');

    return this.refreshTokenService.deleteKey(userId);
  }
}
