import { DataSource } from 'typeorm';
import { seedExamResults } from './import-data.seed';
import { AppDataSource } from 'typeorm.config';

const runSeed = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Kết nối database thành công!');

    await seedExamResults(AppDataSource);

    console.log('Seed hoàn tất!');
    await AppDataSource.destroy();
  } catch (error) {
    console.error('Lỗi khi chạy seed:', error);
    process.exit(1);
  }
};

runSeed();
