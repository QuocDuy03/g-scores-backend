import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as fastcsv from 'fast-csv';
import * as path from 'path';
import { Score } from '@/score/entities/score.entity';
import { Student } from '@/score/entities/student.entity';

export const seedExamResults = async (dataSource: DataSource) => {
  const studentRepo = dataSource.getRepository(Student);
  const scoreRepo = dataSource.getRepository(Score);

  const filePath = path.resolve(process.cwd(), 'data/diem_thi_thpt_2024.csv');

  const subjects = [
    'toan',
    'ngu_van',
    'ngoai_ngu',
    'vat_li',
    'hoa_hoc',
    'sinh_hoc',
    'lich_su',
    'dia_li',
    'gdcd',
  ];

  const results: any[] = [];

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(fastcsv.parse({ headers: true, trim: true }))
      .on('data', (row) => results.push(row))
      .on('end', resolve)
      .on('error', reject);
  });

  for (const row of results) {
    const registrationNumber = row['sbd'].toString();
    const foreignLanguageCode = row['ma_ngoai_ngu'] || null;

    let student = await studentRepo.findOne({ where: { registrationNumber } });
    if (!student) {
      student = studentRepo.create({
        registrationNumber,
        foreignLanguageCode: foreignLanguageCode,
      });
      await studentRepo.save(student);
    }

    for (const subject of subjects) {
      if (row[subject] && row[subject] !== '') {
        const score = scoreRepo.create({
          student,
          subject,
          score: parseFloat(row[subject]),
        });
        await scoreRepo.save(score);
      }
    }
  }

  console.log('Import dữ liệu từ CSV thành công!');
};
