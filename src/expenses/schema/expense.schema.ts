import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DateTime } from 'luxon';
import { Document, Types } from 'mongoose';
import { ExpenseCategory } from './expense-category.enum';

export type ExpenseDocument = Expense & Document;

@Schema()
export class Expense {
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
