import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('sector')
export class Sector extends BaseEntity {
	@Column({ type: 'varchar', length: 255 })
	name!: string;

	@Column({ type: 'varchar', length: 255 })
	description!: string;
}
