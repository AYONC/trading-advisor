import {
	CreateDateColumn,
	DeleteDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
	@PrimaryGeneratedColumn({ unsigned: true })
	id!: number;

	@CreateDateColumn({
		name: 'created_at',
		precision: 0,
		type: 'datetime',
		default: () => 'CURRENT_TIMESTAMP',
		comment: '생성일',
	})
	createdAt!: Date;

	@UpdateDateColumn({
		name: 'updated_at',
		precision: 0,
		type: 'datetime',
		default: () => 'CURRENT_TIMESTAMP',
		onUpdate: 'CURRENT_TIMESTAMP',
		comment: '수정일',
	})
	updatedAt!: Date;

	@DeleteDateColumn({
		name: 'deleted_at',
		precision: 0,
		type: 'datetime',
		nullable: true,
		comment: '삭제일',
	})
	deletedAt?: Date | null;

	get isDeleted() {
		return !!this.deletedAt;
	}

	delete() {
		this.deletedAt = new Date();
	}

	toJson() {
		return JSON.stringify(this);
	}
}
