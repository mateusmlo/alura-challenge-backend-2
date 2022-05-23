import { Expose } from 'class-transformer';
import { Types } from 'mongoose';

export class UserDto {
  @Expose()
  user_id: string;

  @Expose()
  email: string;

  @Expose()
  token?: string;
}
