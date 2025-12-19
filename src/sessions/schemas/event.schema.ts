import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EventType } from '../enums/event-type.enum';

@Schema()
export class ConversationEvent extends Document {
  @Prop({ required: true })
  sessionId: string;

  @Prop({ required: true })
  eventId: string;

  @Prop({ enum: EventType, required: true })
  type: EventType;

  @Prop({ type: Object, required: true })
  payload: Record<string, any>;

  @Prop({ required: true })
  timestamp: Date;
}

export const ConversationEventSchema =
  SchemaFactory.createForClass(ConversationEvent);

ConversationEventSchema.index({ sessionId: 1, eventId: 1 }, { unique: true });

ConversationEventSchema.index({ sessionId: 1, timestamp: 1 });
