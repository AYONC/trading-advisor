import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Stock } from '../stock.entity';

@Entity('earning_stock_analysis')
export class EarningStockAnalysis extends BaseEntity {
	@ManyToOne(() => Stock, { nullable: false })
	stock!: Stock;

	@RelationId<EarningStockAnalysis>((it) => it.stock)
	stockId!: number;

	@Column({ comment: '기간' })
	period!: number;

	@Column({ comment: '주가', type: 'decimal', precision: 16, scale: 2 })
	price!: number;

	@Column({ comment: 'P/E', type: 'decimal', precision: 6, scale: 2 })
	pe!: number; // 0.00 ~ 1000.00

	@Column({ comment: 'ROA', type: 'decimal', precision: 6, scale: 4 })
	roa!: number; // 0.00 ~ 1.00

	@Column({ comment: 'EPS Revision 등급' })
	epsRevisionGrade!: string; // A+, A, A-, B+, B, B-, C+, C, C-, D+, D, D-, E

	@Column({
		comment: 'EPS Growth 조정 비율',
		nullable: true,
		type: 'decimal',
		precision: 6,
		scale: 4,
	})
	epsGrowthAdjustedRate?: number;
}
