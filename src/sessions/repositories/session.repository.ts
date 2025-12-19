import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConversationSession } from '../schemas/session.schema';
import { SessionStatus } from '../enums/session-status.enum';

export class SessionRepository {
  constructor(
    @InjectModel(ConversationSession.name)
    private readonly model: Model<ConversationSession>,
  ) {}

  async findOrCreate(data: Partial<ConversationSession>) {
    return this.model.findOneAndUpdate(
      { sessionId: data.sessionId },
      { $setOnInsert: data },
      { upsert: true, new: true },
    );
  }

  async findBySessionId(sessionId: string) {
    return this.model.findOne({ sessionId });
  }

  async completeSession(sessionId: string) {
    return this.model.findOneAndUpdate(
      { sessionId, status: { $ne: SessionStatus.COMPLETED } },
      {
        status: SessionStatus.COMPLETED,
        endedAt: new Date(),
      },
      { new: true },
    );
  }
}
