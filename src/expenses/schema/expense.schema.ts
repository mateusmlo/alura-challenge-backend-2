import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DateTime } from 'luxon';
import { Document } from 'mongoose';
import { ExpenseCategory } from './expense-category.enum';

@Schema()
export class Expense extends Document {
  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  value: number;

  @Prop({ required: true, default: DateTime.now().toJSDate() })
  date: Date;

  @Prop()
  category: ExpenseCategory;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
