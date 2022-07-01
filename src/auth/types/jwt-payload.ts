import { Types } from 'mongoose';

export type JWTPayload = {
  sub: string;
  email: string;
};
