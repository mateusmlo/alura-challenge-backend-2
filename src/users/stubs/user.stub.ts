import { User } from '../schema/user.schema';
import { Types } from 'mongoose';

export const userStub = (): User => {
  return {
    _id: new Types.ObjectId('1'),
    username: 'test',
    password: 'test123',
  };
};
