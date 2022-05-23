import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { User } from 'src/users/schema/user.schema';
import { UserService } from 'src/users/user.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
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

  async signIn(payload: UserDto): Promise<AuthPayload> {
    const jwtPayload: JWTPayload = {
      email: payload.email,
      sub: payload.user_id,
    };

    const accessToken = await this.jwtService.signAsync(jwtPayload);
    await this.generateRefreshToken(jwtPayload);

    return { accessToken };
  }

  async generateRefreshToken(payload: JWTPayload) {
    const refreshToken = await this.jwtService.signAsync(
      payload,
      this.refreshJwtSignOptions,
    );

    try {
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

  async refreshAccessToken(payload: UserDto) {
    try {
      const tkn = await this.refreshTokenService.getTokenHash(payload.user_id);

      await this.refreshTokenService.validateRefreshToken(tkn, payload.user_id);

      return this.signIn(payload);
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException(err.message);
    }
  }

  async logout(user: JWTPayload) {
    return this.refreshTokenService.deleteKey(user.sub);
  }
}
