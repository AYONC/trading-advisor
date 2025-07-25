import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Stock } from './stock.entity';

@Entity('sales_growth')
export class SalesGrowth extends BaseEntity {
	@ManyToOne(() => Stock, { nullable: false })
	stock!: Stock;

	@RelationId<SalesGrowth>((it) => it.stock)
	stockId!: number;

	@Column({ comment: '기간' })
	period!: number;

	@Column({ comment: '연도' })
	year!: number;

	@Column({ comment: '값' })
	value!: number;

	@Column({ comment: '조정 비율' })
	adjustedRate!: number;
}
