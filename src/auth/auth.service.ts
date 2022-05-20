import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
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

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userService.findOne(username);

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      throw new UnauthorizedException(`Invalid credentials`);

    return user;
  }

  async ping() {
    return this.refreshTokenService.ping();
  }

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;

    const user = await this.userService.createUser({
      username,
      password,
    });

    return user;
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<AuthPayload> {
    const { username, password } = authCredentialsDto;

    const user = await this.userService.findOne(username);
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!user && !isPasswordValid) throw new UnauthorizedException();

    const payload = { username, sub: user._id };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.generateRefreshToken(payload);

    return { accessToken, refreshToken };
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
}
