import { Controller, Get, Param } from '@nestjs/common';
import { ScoreService } from './score.service';

@Controller('score')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Get('search/:id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.scoreService.findOne(id);
    } catch (err) {
      throw err;
    }
  }

  @Get('statistics')
  async getScoreStatisticsBySubject() {
    try {
      return await this.scoreService.getScoreStatisticsBySubject();
    } catch (err) {
      throw err;
    }
  }

  @Get('top10')
  async getTop10StudentsKhoiA() {
    try {
      return await this.scoreService.getTop10StudentsKhoiA();
    } catch (err) {
      throw err;
    }
  }
}
