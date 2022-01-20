import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Receipt extends Document {
  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  value: number;

  @Prop({ required: true, default: Date.now() })
  date: Date;
}

export const ReceiptSchema = SchemaFactory.createForClass(Receipt);
