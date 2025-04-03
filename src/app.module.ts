import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScoreModule } from './score/score.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScoreModule,
    DatabaseModule,
  ],
})
export class AppModule {}
