import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SessionStatus } from '../enums/session-status.enum';

@Schema({ timestamps: true })
export class ConversationSession extends Document {
  @Prop({ unique: true, required: true })
  sessionId: string;

  @Prop({ enum: SessionStatus, default: SessionStatus.INITIATED })
  status: SessionStatus;

  @Prop({ required: true })
  language: string;

  @Prop({ default: Date.now })
  startedAt: Date;

  @Prop({ type: Date, default: null })
  endedAt: Date | null;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const ConversationSessionSchema =
  SchemaFactory.createForClass(ConversationSession);
