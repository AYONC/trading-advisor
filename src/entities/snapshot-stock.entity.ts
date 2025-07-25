import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { BaseEntity } from './base.entity';
import { PeriodSnapshot } from './period-snapshot.entity';
import { Stock } from './stock.entity';

@Entity('snapshot_stock')
export class SnapshotStock extends BaseEntity {
	@ManyToOne(() => Stock, { nullable: false })
	stock!: Stock;

	@RelationId<SnapshotStock>((it) => it.stock)
	stockId!: number;

	@ManyToOne(() => PeriodSnapshot, { nullable: false })
	periodSnapshot!: PeriodSnapshot;

	@RelationId<SnapshotStock>((it) => it.periodSnapshot)
	periodSnapshotId!: number;

	@Column({ comment: '기간' })
	period!: number;

	@Column({ comment: '주식 수' })
	shares!: number;

	@Column({ comment: '매수 단가' })
	buyPrice!: number;

	@Column({ comment: '매도 단가' })
	sellPrice!: number;

	@Column({ comment: '총 수익' })
	profit!: number;

	@Column({ comment: '총 수익률' })
	profitRate!: number;
}
