import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schema/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private logger = new Logger('Users Service');
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new this.userModel({
      username,
      password: hashPassword,
    });

    try {
      return user.save();
    } catch (err) {
      this.logger.error(err);
    }
  }

  async validateLogin(username: string, password: string): Promise<User> {
    const user = await this.userModel.findOne({ username });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      throw new UnauthorizedException(`Invalid credentials`);

    return user;
  }
}
