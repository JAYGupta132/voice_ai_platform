import { IsOptional, IsString } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  sessionId: string;

  @IsString()
  language: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
