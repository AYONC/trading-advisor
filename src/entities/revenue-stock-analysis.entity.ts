import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Stock } from './stock.entity';

@Entity('revenue_stock_analysis')
export class RevenueStockAnalysis extends BaseEntity {
	@ManyToOne(() => Stock, { nullable: false })
	stock!: Stock;

	@RelationId<RevenueStockAnalysis>((it) => it.stock)
	stockId!: number;

	@Column({ comment: '기간' })
	period!: number;

	@Column({ comment: '주가' })
	price!: number;

	@Column({ comment: 'P/S(FWD)' })
	ps!: number;

	@Column({ comment: 'Operating Margin' })
	operatingMargin!: number;
}
