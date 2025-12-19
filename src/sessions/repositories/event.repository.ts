import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConversationEvent } from '../schemas/event.schema';

export class EventRepository {
  constructor(
    @InjectModel(ConversationEvent.name)
    private readonly model: Model<ConversationEvent>,
  ) {}

  async addEvent(event: Partial<ConversationEvent>) {
    try {
      return await this.model.create(event);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error && error.code === 11000) {
        return null;
      }
      throw error;
    }
  }

  async getEvents(sessionId: string, limit = 20, offset = 0) {
    return this.model
      .find({ sessionId })
      .sort({ timestamp: 1 })
      .skip(offset)
      .limit(limit);
  }
}
