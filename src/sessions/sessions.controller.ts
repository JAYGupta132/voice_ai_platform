import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { AddEventDto } from './dto/add-event.dto';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly service: SessionsService) {}

  @Post()
  createSession(@Body() dto: CreateSessionDto) {
    return this.service.createOrGetSession(dto);
  }

  @Post(':sessionId/events')
  addEvent(@Param('sessionId') sessionId: string, @Body() dto: AddEventDto) {
    return this.service.addEvent(sessionId, dto);
  }

  @Get(':sessionId')
  getSession(
    @Param('sessionId') sessionId: string,
    @Query('limit') limit = 20,
    @Query('offset') offset = 0,
  ) {
    return this.service.getSession(sessionId, Number(limit), Number(offset));
  }

  @Post(':sessionId/complete')
  complete(@Param('sessionId') sessionId: string) {
    return this.service.completeSession(sessionId);
  }
}
