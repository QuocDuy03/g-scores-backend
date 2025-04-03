import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Score } from './score.entity';

@Entity('students')
export class Student {
  @PrimaryColumn()
  registrationNumber: string;

  @Column({ nullable: true })
  foreignLanguageCode: string;

  @OneToMany(() => Score, (score) => score.student)
  scores: Score[];
}
