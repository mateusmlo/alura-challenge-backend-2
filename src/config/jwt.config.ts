import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(private configService: ConfigService) {}

  createJwtOptions(): JwtModuleOptions {
    return {
      secret: this.configService.get<string>('secret'),
      signOptions: {
        expiresIn: this.configService.get<string>('signOptions.expiresIn'),
        issuer: 'ALTIMIT Corp.',
      },
    };
  }
}
