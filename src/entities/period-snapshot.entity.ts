import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('period_snapshot')
export class PeriodSnapshot extends BaseEntity {
	@Column({ comment: '기간' })
	period!: number;

	@Column({ comment: '시작 일자' })
	startAt!: Date;

	@Column({ comment: '투자 원금', type: 'decimal', precision: 16, scale: 2 })
	amount!: number;

	@Column({ comment: '이월 원금', type: 'decimal', precision: 16, scale: 2 })
	carryover!: number;

	@Column({ comment: '총 매수 금액', type: 'decimal', precision: 16, scale: 2 })
	buyAmount!: number;

	@Column({ comment: '총 매도 금액', type: 'decimal', precision: 16, scale: 2 })
	sellAmount!: number;

	@Column({ comment: '총 수익', type: 'decimal', precision: 16, scale: 2 })
	profit!: number;

	@Column({ comment: '총 수익률', type: 'decimal', precision: 6, scale: 4 })
	profitRate!: number;
}
