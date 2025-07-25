import type { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1753409721993 implements MigrationInterface {
	name = 'Migration1753409721993';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE \`sector\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`created_at\` datetime(0) NOT NULL COMMENT '생성일' DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime(0) NOT NULL COMMENT '수정일' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(0) NULL COMMENT '삭제일', \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`stock\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`created_at\` datetime(0) NOT NULL COMMENT '생성일' DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime(0) NOT NULL COMMENT '수정일' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(0) NULL COMMENT '삭제일', \`ticker\` varchar(10) NOT NULL, \`company_name\` varchar(255) NOT NULL, \`sector_id\` int UNSIGNED NOT NULL, UNIQUE INDEX \`IDX_b5602443b4cca67e34f828c463\` (\`ticker\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`earning_stock_analysis\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`created_at\` datetime(0) NOT NULL COMMENT '생성일' DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime(0) NOT NULL COMMENT '수정일' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(0) NULL COMMENT '삭제일', \`period\` int NOT NULL COMMENT '기간', \`price\` int NOT NULL COMMENT '주가', \`pe\` int NOT NULL COMMENT 'P/E', \`roa\` int NOT NULL COMMENT 'ROA', \`eps_revision_grade\` varchar(255) NOT NULL COMMENT 'EPS Revision 등급', \`stock_id\` int UNSIGNED NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`eps_growth\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`created_at\` datetime(0) NOT NULL COMMENT '생성일' DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime(0) NOT NULL COMMENT '수정일' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(0) NULL COMMENT '삭제일', \`period\` int NOT NULL COMMENT '기간', \`year\` int NOT NULL COMMENT '연도', \`value\` int NOT NULL COMMENT '값', \`adjusted_rate\` int NOT NULL COMMENT '조정 비율', \`stock_id\` int UNSIGNED NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`period\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`created_at\` datetime(0) NOT NULL COMMENT '생성일' DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime(0) NOT NULL COMMENT '수정일' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(0) NULL COMMENT '삭제일', \`period\` int NOT NULL COMMENT '기간', \`start_at\` datetime NOT NULL COMMENT '시작 일자', \`end_at\` datetime NOT NULL COMMENT '종료 일자', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`period_snapshot\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`created_at\` datetime(0) NOT NULL COMMENT '생성일' DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime(0) NOT NULL COMMENT '수정일' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(0) NULL COMMENT '삭제일', \`period\` int NOT NULL COMMENT '기간', \`start_at\` datetime NOT NULL COMMENT '시작 일자', \`amount\` int NOT NULL COMMENT '투자 원금', \`carryover\` int NOT NULL COMMENT '이월 원금', \`buy_amount\` int NOT NULL COMMENT '총 매수 금액', \`sell_amount\` int NOT NULL COMMENT '총 매도 금액', \`profit\` int NOT NULL COMMENT '총 수익', \`profit_rate\` int NOT NULL COMMENT '총 수익률', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`revenue_stock_analysis\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`created_at\` datetime(0) NOT NULL COMMENT '생성일' DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime(0) NOT NULL COMMENT '수정일' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(0) NULL COMMENT '삭제일', \`period\` int NOT NULL COMMENT '기간', \`price\` int NOT NULL COMMENT '주가', \`ps\` int NOT NULL COMMENT 'P/S(FWD)', \`operating_margin\` int NOT NULL COMMENT 'Operating Margin', \`stock_id\` int UNSIGNED NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`sales_growth\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`created_at\` datetime(0) NOT NULL COMMENT '생성일' DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime(0) NOT NULL COMMENT '수정일' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(0) NULL COMMENT '삭제일', \`period\` int NOT NULL COMMENT '기간', \`year\` int NOT NULL COMMENT '연도', \`value\` int NOT NULL COMMENT '값', \`adjusted_rate\` int NOT NULL COMMENT '조정 비율', \`stock_id\` int UNSIGNED NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`sector_ratio\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`created_at\` datetime(0) NOT NULL COMMENT '생성일' DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime(0) NOT NULL COMMENT '수정일' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(0) NULL COMMENT '삭제일', \`period\` int NOT NULL COMMENT '기간', \`roa\` int NOT NULL COMMENT 'Sector ROA', \`peg_ratio\` int NOT NULL COMMENT 'Sector PEG Ratio', \`psg_ratio\` int NOT NULL COMMENT 'Sector PSG Ratio', \`operating_margin\` int NOT NULL COMMENT 'Sector Operating Margin', \`sector_id\` int UNSIGNED NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`snapshot_stock\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`created_at\` datetime(0) NOT NULL COMMENT '생성일' DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime(0) NOT NULL COMMENT '수정일' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(0) NULL COMMENT '삭제일', \`period\` int NOT NULL COMMENT '기간', \`shares\` int NOT NULL COMMENT '주식 수', \`buy_price\` int NOT NULL COMMENT '매수 단가', \`sell_price\` int NOT NULL COMMENT '매도 단가', \`profit\` int NOT NULL COMMENT '총 수익', \`profit_rate\` int NOT NULL COMMENT '총 수익률', \`stock_id\` int UNSIGNED NOT NULL, \`period_snapshot_id\` int UNSIGNED NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`trade_order\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`created_at\` datetime(0) NOT NULL COMMENT '생성일' DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime(0) NOT NULL COMMENT '수정일' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(0) NULL COMMENT '삭제일', \`period\` int NOT NULL COMMENT '기간', \`action\` varchar(255) NOT NULL, \`shares\` int NOT NULL, \`price\` int NOT NULL, \`total_amount\` int NOT NULL, \`ordered_at\` datetime NOT NULL, \`stock_id\` int UNSIGNED NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`ALTER TABLE \`stock\` ADD CONSTRAINT \`FK_3063a98959cf4177d59440d91ad\` FOREIGN KEY (\`sector_id\`) REFERENCES \`sector\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`earning_stock_analysis\` ADD CONSTRAINT \`FK_60cf986cdd798d79ff10f24d7e4\` FOREIGN KEY (\`stock_id\`) REFERENCES \`stock\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`eps_growth\` ADD CONSTRAINT \`FK_de861fcb4927e0f92106b1c8585\` FOREIGN KEY (\`stock_id\`) REFERENCES \`stock\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`revenue_stock_analysis\` ADD CONSTRAINT \`FK_6b5ba022a7e9a41d64b3afab4b4\` FOREIGN KEY (\`stock_id\`) REFERENCES \`stock\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`sales_growth\` ADD CONSTRAINT \`FK_ecfc13bd0a8812c0efe408ff5da\` FOREIGN KEY (\`stock_id\`) REFERENCES \`stock\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`sector_ratio\` ADD CONSTRAINT \`FK_7432202100724d0e2a1b4fb38fa\` FOREIGN KEY (\`sector_id\`) REFERENCES \`sector\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`snapshot_stock\` ADD CONSTRAINT \`FK_4c5366e17583d79b2799fca1864\` FOREIGN KEY (\`stock_id\`) REFERENCES \`stock\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`snapshot_stock\` ADD CONSTRAINT \`FK_a3d5a2f126d2eb3a31ca28358ab\` FOREIGN KEY (\`period_snapshot_id\`) REFERENCES \`period_snapshot\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`trade_order\` ADD CONSTRAINT \`FK_7226b13ee44d01905b3cc157860\` FOREIGN KEY (\`stock_id\`) REFERENCES \`stock\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`trade_order\` DROP FOREIGN KEY \`FK_7226b13ee44d01905b3cc157860\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`snapshot_stock\` DROP FOREIGN KEY \`FK_a3d5a2f126d2eb3a31ca28358ab\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`snapshot_stock\` DROP FOREIGN KEY \`FK_4c5366e17583d79b2799fca1864\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`sector_ratio\` DROP FOREIGN KEY \`FK_7432202100724d0e2a1b4fb38fa\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`sales_growth\` DROP FOREIGN KEY \`FK_ecfc13bd0a8812c0efe408ff5da\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`revenue_stock_analysis\` DROP FOREIGN KEY \`FK_6b5ba022a7e9a41d64b3afab4b4\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`eps_growth\` DROP FOREIGN KEY \`FK_de861fcb4927e0f92106b1c8585\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`earning_stock_analysis\` DROP FOREIGN KEY \`FK_60cf986cdd798d79ff10f24d7e4\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`stock\` DROP FOREIGN KEY \`FK_3063a98959cf4177d59440d91ad\``,
		);
		await queryRunner.query(`DROP TABLE \`trade_order\``);
		await queryRunner.query(`DROP TABLE \`snapshot_stock\``);
		await queryRunner.query(`DROP TABLE \`sector_ratio\``);
		await queryRunner.query(`DROP TABLE \`sales_growth\``);
		await queryRunner.query(`DROP TABLE \`revenue_stock_analysis\``);
		await queryRunner.query(`DROP TABLE \`period_snapshot\``);
		await queryRunner.query(`DROP TABLE \`period\``);
		await queryRunner.query(`DROP TABLE \`eps_growth\``);
		await queryRunner.query(`DROP TABLE \`earning_stock_analysis\``);
		await queryRunner.query(
			`DROP INDEX \`IDX_b5602443b4cca67e34f828c463\` ON \`stock\``,
		);
		await queryRunner.query(`DROP TABLE \`stock\``);
		await queryRunner.query(`DROP TABLE \`sector\``);
	}
}
