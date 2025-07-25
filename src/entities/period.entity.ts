import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('period')
export class Period extends BaseEntity {
	@Column({ comment: '기간' })
	period!: number;

	@Column({ comment: '시작 일자' })
	startAt!: Date;

	@Column({ comment: '종료 일자' })
	endAt!: Date;
}
