import { Injectable } from '@nestjs/common';
import { Student } from './entities/student.entity';
import { Score } from './entities/score.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ScoreService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,
  ) {}
  async findOne(registrationNumber: string) {
    const examResult = await this.studentRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.scores', 'scores')
      .where('student.registrationNumber = :registrationNumber', {
        registrationNumber,
      })
      .getOne();
    return examResult;
  }

  async getScoreStatisticsBySubject() {
    const queryBuilder = this.scoreRepository.createQueryBuilder('score');

    const results = await queryBuilder
      .select([
        'subject',
        `SUM(CASE WHEN score.score >= 8 THEN 1 ELSE 0 END) AS "8_points_or_more"`,
        `SUM(CASE WHEN score.score >= 6 AND score.score < 8 THEN 1 ELSE 0 END) AS "from_6_to_less_than_8_points"`,
        `SUM(CASE WHEN score.score >= 4 AND score.score < 6 THEN 1 ELSE 0 END) AS "from_4_to_less_than_6_points"`,
        `SUM(CASE WHEN score.score < 4 THEN 1 ELSE 0 END) AS "less_than_4_points"`,
      ])
      .groupBy('score.subject')
      .getRawMany();

    return {
      labels: results.map((row) => row.subject),
      data: {
        below4: results.map((row) => Number(row['less_than_4_points'])),
        between4And6: results.map((row) =>
          Number(row['from_4_to_less_than_6_points']),
        ),
        between6And8: results.map((row) =>
          Number(row['from_6_to_less_than_8_points']),
        ),
        above8: results.map((row) => Number(row['8_points_or_more'])),
      },
    };
  }

  async getTop10StudentsKhoiA() {
    const rawResults = await this.studentRepository
      .createQueryBuilder('student')
      .leftJoin('student.scores', 'score')
      .select([
        'student.registrationNumber AS registrationNumber',
        'SUM(score.score) AS totalScore',
        "MAX(CASE WHEN score.subject = 'toan' THEN score.score END) AS math",
        "MAX(CASE WHEN score.subject = 'vat_li' THEN score.score END) AS physics",
        "MAX(CASE WHEN score.subject = 'hoa_hoc' THEN score.score END) AS chemistry",
      ])
      .where('score.subject IN (:...subjects)', {
        subjects: ['toan', 'vat_li', 'hoa_hoc'],
      })
      .groupBy('student.registrationNumber')
      .orderBy('totalScore', 'DESC')
      .limit(10)
      .getRawMany();

    return rawResults.map((item) => ({
      registrationNumber: item.registrationnumber,
      totalScore: item.totalscore,
      math: item.math,
      physics: item.physics,
      chemistry: item.chemistry,
    }));
  }
}
