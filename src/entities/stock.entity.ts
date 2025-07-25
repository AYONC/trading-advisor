import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Sector } from './sector.entity';

@Entity('stock')
export class Stock extends BaseEntity {
	@Column({ type: 'varchar', length: 10, unique: true })
	ticker!: string;

	@Column({ type: 'varchar', length: 255 })
	companyName!: string;

	@ManyToOne(() => Sector, { nullable: false })
	sector!: Sector;

	@RelationId<Stock>((it) => it.sector)
	sectorId!: number;
}
