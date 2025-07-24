import type { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1753342292652 implements MigrationInterface {
	name = 'Migration1753342292652';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE \`weekly_snapshot\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`created_at\` datetime(0) NOT NULL COMMENT '생성일' DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime(0) NOT NULL COMMENT '수정일' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(0) NULL COMMENT '삭제일', \`week_number\` int NOT NULL, \`week_ending_date\` datetime NOT NULL, \`cash_balance\` int NOT NULL, \`total_portfolio_value\` int NOT NULL, \`analysis_data_ref\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`snapshot_holding\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`created_at\` datetime(0) NOT NULL COMMENT '생성일' DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime(0) NOT NULL COMMENT '수정일' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(0) NULL COMMENT '삭제일', \`ticker\` varchar(255) NOT NULL, \`shares\` int NOT NULL, \`avg_cost_basis\` int NOT NULL, \`market_value_at_snapshot\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`trade_order\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`created_at\` datetime(0) NOT NULL COMMENT '생성일' DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime(0) NOT NULL COMMENT '수정일' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(0) NULL COMMENT '삭제일', \`week_number\` int NOT NULL, \`ticker\` varchar(255) NOT NULL, \`action\` varchar(255) NOT NULL, \`shares\` int NOT NULL, \`price\` int NOT NULL, \`total_amount\` int NOT NULL, \`ordered_at\` datetime NOT NULL, \`status\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE \`trade_order\``);
		await queryRunner.query(`DROP TABLE \`snapshot_holding\``);
		await queryRunner.query(`DROP TABLE \`weekly_snapshot\``);
	}
}
