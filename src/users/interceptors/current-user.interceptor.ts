import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { UserService } from '../user.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private userService: UserService) {}

  async intercept(ctx: ExecutionContext, handler: CallHandler) {
    const req = ctx.switchToHttp().getRequest();
    const { email } = req || {};

    if (email) {
      const user = await this.userService.findOne(email);

      req.user = user;
    }

    return handler.handle();
  }
}
