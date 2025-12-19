import { Injectable, NotFoundException } from '@nestjs/common';
import { SessionRepository } from './repositories/session.repository';
import { EventRepository } from './repositories/event.repository';
import { CreateSessionDto } from './dto/create-session.dto';
import { AddEventDto } from './dto/add-event.dto';

@Injectable()
export class SessionsService {
  constructor(
    private readonly sessionRepo: SessionRepository,
    private readonly eventRepo: EventRepository,
  ) {}

  createOrGetSession(dto: CreateSessionDto) {
    return this.sessionRepo.findOrCreate({
      sessionId: dto.sessionId,
      language: dto.language,
      metadata: dto.metadata,
      startedAt: new Date(),
    });
  }

  async addEvent(sessionId: string, dto: AddEventDto) {
    const session = await this.sessionRepo.findBySessionId(sessionId);
    if (!session) throw new NotFoundException('Session not found');

    await this.eventRepo.addEvent({
      sessionId,
      eventId: dto.eventId,
      type: dto.type,
      payload: dto.payload,
      timestamp: new Date(dto.timestamp),
    });

    return { success: true };
  }

  async getSession(sessionId: string, limit: number, offset: number) {
    const session = await this.sessionRepo.findBySessionId(sessionId);
    if (!session) throw new NotFoundException('Session not found');

    const events = await this.eventRepo.getEvents(sessionId, limit, offset);

    return { session, events };
  }

  async completeSession(sessionId: string) {
    const session = await this.sessionRepo.completeSession(sessionId);
    if (!session) throw new NotFoundException('Session not found');
    return session;
  }
}
