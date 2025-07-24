import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('snapshot_holding')
export class SnapshotHolding extends BaseEntity {
	@Column()
	ticker!: string;

	@Column()
	shares!: number;

	@Column()
	avgCostBasis!: number;

	@Column()
	marketValueAtSnapshot!: number;
}
