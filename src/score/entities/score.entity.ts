import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Student } from './student.entity';

@Entity('scores')
export class Score {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  subject: string;

  @Column({ type: 'float' })
  score: number;

  @ManyToOne(() => Student, (student) => student.scores, {
    onDelete: 'CASCADE',
  })
  student: Student;
}
