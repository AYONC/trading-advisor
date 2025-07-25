import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Stock } from '../stock.entity';

@Entity('revenue_stock_analysis')
export class RevenueStockAnalysis extends BaseEntity {
	@ManyToOne(() => Stock, { nullable: false })
	stock!: Stock;

	@RelationId<RevenueStockAnalysis>((it) => it.stock)
	stockId!: number;

	@Column({ comment: '기간' })
	period!: number;

	@Column({ comment: '주가', type: 'decimal', precision: 16, scale: 2 })
	price!: number;

	@Column({ comment: 'P/S(FWD)', type: 'decimal', precision: 6, scale: 4 })
	ps!: number;

	@Column({
		comment: 'Operating Margin',
		type: 'decimal',
		precision: 6,
		scale: 4,
	})
	operatingMargin!: number;

	@Column({
		comment: 'Sales Growth 조정 비율',
		nullable: true,
		type: 'decimal',
		precision: 6,
		scale: 4,
	})
	salesGrowthAdjustedRate?: number;
}
