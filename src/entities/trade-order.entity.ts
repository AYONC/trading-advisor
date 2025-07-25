import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import type { TradeAction } from '@/constants/trade';
import { BaseEntity } from './base.entity';
import { Stock } from './stock.entity';

@Entity('trade_order')
export class TradeOrder extends BaseEntity {
	@Column({ comment: '기간' })
	period!: number;

	@ManyToOne(() => Stock, { nullable: false })
	stock!: Stock;

	@RelationId<TradeOrder>((it) => it.stock)
	stockId!: number;

	@Column()
	action!: TradeAction;

	@Column({ type: 'decimal', precision: 6, scale: 2 })
	shares!: number;

	@Column({ type: 'decimal', precision: 16, scale: 2 })
	price!: number;

	@Column()
	totalAmount!: number;

	@Column({ type: 'datetime' })
	orderedAt!: Date;
}
