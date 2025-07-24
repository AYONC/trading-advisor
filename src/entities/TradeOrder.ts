import { Column, Entity } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity('trade_order')
export class TradeOrder extends BaseEntity {
	@Column({ name: 'week_number' })
	weekNumber!: number;

	@Column()
	ticker!: string;

	@Column()
	action!: 'buy' | 'sell';

	@Column()
	shares!: number;

	@Column()
	price!: number;

	@Column()
	totalAmount!: number;

	@Column({ type: 'datetime' })
	orderedAt!: Date;

	@Column()
	status!: 'planned' | 'completed' | 'cancelled';
}
