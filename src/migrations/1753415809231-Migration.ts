import type { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1753415809231 implements MigrationInterface {
	name = 'Migration1753415809231';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`eps_growth\` DROP COLUMN \`adjusted_rate\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`sales_growth\` DROP COLUMN \`adjusted_rate\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`earning_stock_analysis\` ADD \`eps_growth_adjusted_rate\` int NULL COMMENT 'EPS Growth 조정 비율'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`revenue_stock_analysis\` ADD \`sales_growth_adjusted_rate\` int NULL COMMENT 'Sales Growth 조정 비율'`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`revenue_stock_analysis\` DROP COLUMN \`sales_growth_adjusted_rate\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`earning_stock_analysis\` DROP COLUMN \`eps_growth_adjusted_rate\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`sales_growth\` ADD \`adjusted_rate\` int NULL COMMENT '조정 비율'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`eps_growth\` ADD \`adjusted_rate\` int NULL COMMENT '조정 비율'`,
		);
	}
}
