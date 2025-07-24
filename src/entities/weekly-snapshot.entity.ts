import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('weekly_snapshot')
export class WeeklySnapshot extends BaseEntity {
	@Column()
	weekNumber!: number;

	@Column({ type: 'datetime', name: 'week_ending_date' })
	weekEndingDate!: Date;

	@Column()
	cashBalance!: number;

	@Column()
	totalPortfolioValue!: number;

	@Column()
	analysisDataRef!: string;
}
