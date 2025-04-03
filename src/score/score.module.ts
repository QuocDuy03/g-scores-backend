import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ScoreService } from './score.service';
import { ScoreController } from './score.controller';

import { Student } from './entities/student.entity';
import { Score } from './entities/score.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student, Score])],
  controllers: [ScoreController],
  providers: [ScoreService],
  exports: [ScoreService],
})
export class ScoreModule {}
