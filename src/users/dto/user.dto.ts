import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  user_id: string;

  @Expose()
  email: string;
}
