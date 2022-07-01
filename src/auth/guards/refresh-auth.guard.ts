import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class RefreshGuard extends AuthGuard('refresh') {
  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: any,
    status?: any,
  ): TUser {
    if (info instanceof JsonWebTokenError || info instanceof TokenExpiredError)
      console.log(info.message);

    return user;
  }
}
