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
    const { user_id } = req || {};

    if (user_id) {
      const user = await this.userService.findOne(user_id);

      req.user = user;
    }

    return handler.handle();
  }
}
