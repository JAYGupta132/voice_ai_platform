import { IsEnum, IsObject, IsString } from 'class-validator';
import { EventType } from '../enums/event-type.enum';

export class AddEventDto {
  @IsString()
  eventId: string;

  @IsEnum(EventType)
  type: EventType;

  @IsObject()
  payload: Record<string, any>;

  @IsString()
  timestamp: string;
}
