import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../../users/schema/user.schema';
import { ExpenseCategory } from './expense-category.enum';

export type ExpenseDocument = Expense & Document;

@Schema({ versionKey: false })
export class Expense {
  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  value: number;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'user' })
  user: User;

  @Prop({ default: ExpenseCategory.Others })
  category: ExpenseCategory;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
