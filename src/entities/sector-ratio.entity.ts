import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Sector } from './sector.entity';

@Entity('sector_ratio')
export class SectorRatio extends BaseEntity {
	@ManyToOne(() => Sector, { nullable: false })
	sector!: Sector;

	@RelationId<SectorRatio>((it) => it.sector)
	sectorId!: number;

	@Column({ comment: '기간' })
	period!: number;

	@Column({ comment: 'Sector ROA' })
	roa!: number;

	@Column({ comment: 'Sector PEG Ratio' })
	pegRatio!: number;

	@Column({ comment: 'Sector PSG Ratio' })
	psgRatio!: number;

	@Column({ comment: 'Sector Operating Margin' })
	operatingMargin!: number;
}
