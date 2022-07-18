import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ClassConstructor {
  new (...args: any[]);
}

/**
 * A decorator to serialize and sanitize any object through the use of a DTO
 * e.g by using a UserDto we can expose certain properties that are ok to be
 * inside the response, like the user's email or name. Any other props are going to be excluded.
 *
 * @param dto Class
 */
export const Serialize = (dto: ClassConstructor) => {
  return UseInterceptors(new SerializeInterceptor(dto));
};

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        return instanceToPlain(this.dto, data);
      }),
    );
  }
}
