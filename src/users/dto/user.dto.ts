import { Expose } from 'class-transformer';
import { Types } from 'mongoose';

export class UserDto {
  @Expose()
  user_id: Types.ObjectId;

  @Expose()
  username: string;
}
