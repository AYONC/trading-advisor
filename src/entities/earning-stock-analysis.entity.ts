import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Stock } from './stock.entity';

@Entity('earning_stock_analysis')
export class EarningStockAnalysis extends BaseEntity {
	@ManyToOne(() => Stock, { nullable: false })
	stock!: Stock;

	@RelationId<EarningStockAnalysis>((it) => it.stock)
	stockId!: number;

	@Column({ comment: '기간' })
	period!: number;

	@Column({ comment: '주가' })
	price!: number;

	@Column({ comment: 'P/E' })
	pe!: number; // 0.00 ~ 1000.00

	@Column({ comment: 'ROA' })
	roa!: number; // 0.00 ~ 1.00

	@Column({ comment: 'EPS Revision 등급' })
	epsRevisionGrade!: string; // A, B, C, D, E
}
