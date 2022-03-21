import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schema/user.schema';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from 'src/users/user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtConfigService } from 'src/config/jwt.config';
import { RefreshTokenService } from './refresh-token.service';
import { RefreshStrategy } from './strategies/refresh.strategy';

@Module({
  imports: [
    PassportModule,
    UserModule,
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    RefreshStrategy,
    RefreshTokenService,
  ],
  exports: [AuthService, PassportModule],
})
export class AuthModule {}
