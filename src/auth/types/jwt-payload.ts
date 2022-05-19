import { Types } from 'mongoose';

export type JWTPayload = {
  sub: Types.ObjectId;
  username: string;
};
