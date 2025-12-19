import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionsModule } from './sessions/sessions.module';

const DB_URI = process.env.DB_URI;
@Module({
  imports: [MongooseModule.forRoot(DB_URI as string), SessionsModule],
})
export class AppModule {}
