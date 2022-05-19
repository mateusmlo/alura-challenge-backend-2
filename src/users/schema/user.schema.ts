import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Type } from 'class-transformer';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ _id: false })
export class User {
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  @Exclude()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
