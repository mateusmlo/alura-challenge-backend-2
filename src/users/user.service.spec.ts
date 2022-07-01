import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { MockType } from '../common/mocks/mock.type';
import { modelMock } from '../common/mocks/model.mock';
import { User } from './schema/user.schema';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserService', () => {
  let service: UserService;
  let model: MockType<Model<User>>;
  const vUser: User = {
    email: 'test@test.com',
    password: '31872#&(@*fbnhHJ',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useFactory: modelMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(model).toBeDefined();
  });

  describe('createUser', () => {
    let createUserDto: CreateUserDto;

    beforeEach(() => {
      createUserDto = {
        email: 'test@test.com',
        password: '31872#&(@*fbnhHJ',
      };
    });

    it('should create a new user', async () => {
      model.create.mockReturnValue(vUser);

      const newUser = await service.createUser(createUserDto);

      expect(newUser).toEqual(vUser);
    });
  });
});
