import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { DateTime } from 'luxon';
import mongoose, { Document } from 'mongoose';
import { User } from '../../users/schema/user.schema';

export type ReceiptDocument = Receipt & Document;

@Schema({ versionKey: false })
export class Receipt {
  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  value: number;

  @Prop({ required: true, default: DateTime.now().toJSDate() })
  date: Date;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'user' })
  user: User;
}

export const ReceiptSchema = SchemaFactory.createForClass(Receipt);
