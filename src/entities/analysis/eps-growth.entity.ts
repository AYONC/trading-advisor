import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Stock } from '../stock.entity';

@Entity('eps_growth')
export class EpsGrowth extends BaseEntity {
	@ManyToOne(() => Stock, { nullable: false })
	stock!: Stock;

	@RelationId<EpsGrowth>((it) => it.stock)
	stockId!: number;

	@Column({ comment: '기간' })
	period!: number;

	@Column({ comment: '연도' })
	year!: number;

	@Column({ comment: '값', type: 'decimal', precision: 6, scale: 4 })
	value!: number;
}
