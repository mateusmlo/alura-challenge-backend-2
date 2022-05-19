import { MockType } from './mock.type';
import { Model } from 'mongoose';

export const modelMock: () => MockType<Model<any>> = jest.fn(
  () =>
    ({
      create: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      deleteOne: jest.fn(),
      updateOne: jest.fn(),
      aggregate: jest.fn(),
    } as any),
);
