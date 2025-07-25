import type { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1753416857904 implements MigrationInterface {
	name = 'Migration1753416857904';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`earning_stock_analysis\` DROP COLUMN \`price\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`earning_stock_analysis\` ADD \`price\` decimal(16,2) NOT NULL COMMENT '주가'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`earning_stock_analysis\` DROP COLUMN \`pe\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`earning_stock_analysis\` ADD \`pe\` decimal(6,2) NOT NULL COMMENT 'P/E'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`earning_stock_analysis\` DROP COLUMN \`roa\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`earning_stock_analysis\` ADD \`roa\` decimal(6,4) NOT NULL COMMENT 'ROA'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`earning_stock_analysis\` DROP COLUMN \`eps_growth_adjusted_rate\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`earning_stock_analysis\` ADD \`eps_growth_adjusted_rate\` decimal(6,4) NULL COMMENT 'EPS Growth 조정 비율'`,
		);
		await queryRunner.query(`ALTER TABLE \`eps_growth\` DROP COLUMN \`value\``);
		await queryRunner.query(
			`ALTER TABLE \`eps_growth\` ADD \`value\` decimal(6,4) NOT NULL COMMENT '값'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`revenue_stock_analysis\` DROP COLUMN \`price\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`revenue_stock_analysis\` ADD \`price\` decimal(16,2) NOT NULL COMMENT '주가'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`revenue_stock_analysis\` DROP COLUMN \`ps\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`revenue_stock_analysis\` ADD \`ps\` decimal(6,4) NOT NULL COMMENT 'P/S(FWD)'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`revenue_stock_analysis\` DROP COLUMN \`operating_margin\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`revenue_stock_analysis\` ADD \`operating_margin\` decimal(6,4) NOT NULL COMMENT 'Operating Margin'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`revenue_stock_analysis\` DROP COLUMN \`sales_growth_adjusted_rate\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`revenue_stock_analysis\` ADD \`sales_growth_adjusted_rate\` decimal(6,4) NULL COMMENT 'Sales Growth 조정 비율'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`sales_growth\` DROP COLUMN \`value\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`sales_growth\` ADD \`value\` decimal(6,4) NOT NULL COMMENT '값'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`period_snapshot\` DROP COLUMN \`amount\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`period_snapshot\` ADD \`amount\` decimal(16,2) NOT NULL COMMENT '투자 원금'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`period_snapshot\` DROP COLUMN \`carryover\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`period_snapshot\` ADD \`carryover\` decimal(16,2) NOT NULL COMMENT '이월 원금'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`period_snapshot\` DROP COLUMN \`buy_amount\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`period_snapshot\` ADD \`buy_amount\` decimal(16,2) NOT NULL COMMENT '총 매수 금액'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`period_snapshot\` DROP COLUMN \`sell_amount\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`period_snapshot\` ADD \`sell_amount\` decimal(16,2) NOT NULL COMMENT '총 매도 금액'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`period_snapshot\` DROP COLUMN \`profit\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`period_snapshot\` ADD \`profit\` decimal(16,2) NOT NULL COMMENT '총 수익'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`period_snapshot\` DROP COLUMN \`profit_rate\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`period_snapshot\` ADD \`profit_rate\` decimal(6,4) NOT NULL COMMENT '총 수익률'`,
		);
		await queryRunner.query(`ALTER TABLE \`sector_ratio\` DROP COLUMN \`roa\``);
		await queryRunner.query(
			`ALTER TABLE \`sector_ratio\` ADD \`roa\` decimal(6,4) NOT NULL COMMENT 'Sector ROA'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`sector_ratio\` DROP COLUMN \`peg_ratio\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`sector_ratio\` ADD \`peg_ratio\` decimal(6,4) NOT NULL COMMENT 'Sector PEG Ratio'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`sector_ratio\` DROP COLUMN \`psg_ratio\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`sector_ratio\` ADD \`psg_ratio\` decimal(6,4) NOT NULL COMMENT 'Sector PSG Ratio'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`sector_ratio\` DROP COLUMN \`operating_margin\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`sector_ratio\` ADD \`operating_margin\` decimal(6,4) NOT NULL COMMENT 'Sector Operating Margin'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`snapshot_stock\` DROP COLUMN \`shares\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`snapshot_stock\` ADD \`shares\` decimal(6,2) NOT NULL COMMENT '주식 수'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`snapshot_stock\` DROP COLUMN \`buy_price\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`snapshot_stock\` ADD \`buy_price\` decimal(16,2) NOT NULL COMMENT '매수 단가'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`snapshot_stock\` DROP COLUMN \`sell_price\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`snapshot_stock\` ADD \`sell_price\` decimal(16,2) NOT NULL COMMENT '매도 단가'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`snapshot_stock\` DROP COLUMN \`profit\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`snapshot_stock\` ADD \`profit\` decimal(16,2) NOT NULL COMMENT '총 수익'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`snapshot_stock\` DROP COLUMN \`profit_rate\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`snapshot_stock\` ADD \`profit_rate\` decimal(6,4) NOT NULL COMMENT '총 수익률'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`trade_order\` DROP COLUMN \`shares\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`trade_order\` ADD \`shares\` decimal(6,2) NOT NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE \`trade_order\` DROP COLUMN \`price\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`trade_order\` ADD \`price\` decimal(16,2) NOT NULL`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`trade_order\` DROP COLUMN \`price\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`trade_order\` ADD \`price\` int NOT NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE \`trade_order\` DROP COLUMN \`shares\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`trade_order\` ADD \`shares\` int NOT NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE \`snapshot_stock\` DROP COLUMN \`profit_rate\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`snapshot_stock\` ADD \`profit_rate\` int NOT NULL COMMENT '총 수익률'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`snapshot_stock\` DROP COLUMN \`profit\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`snapshot_stock\` ADD \`profit\` int NOT NULL COMMENT '총 수익'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`snapshot_stock\` DROP COLUMN \`sell_price\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`snapshot_stock\` ADD \`sell_price\` int NOT NULL COMMENT '매도 단가'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`snapshot_stock\` DROP COLUMN \`buy_price\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`snapshot_stock\` ADD \`buy_price\` int NOT NULL COMMENT '매수 단가'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`snapshot_stock\` DROP COLUMN \`shares\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`snapshot_stock\` ADD \`shares\` int NOT NULL COMMENT '주식 수'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`sector_ratio\` DROP COLUMN \`operating_margin\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`sector_ratio\` ADD \`operating_margin\` int NOT NULL COMMENT 'Sector Operating Margin'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`sector_ratio\` DROP COLUMN \`psg_ratio\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`sector_ratio\` ADD \`psg_ratio\` int NOT NULL COMMENT 'Sector PSG Ratio'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`sector_ratio\` DROP COLUMN \`peg_ratio\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`sector_ratio\` ADD \`peg_ratio\` int NOT NULL COMMENT 'Sector PEG Ratio'`,
		);
		await queryRunner.query(`ALTER TABLE \`sector_ratio\` DROP COLUMN \`roa\``);
		await queryRunner.query(
			`ALTER TABLE \`sector_ratio\` ADD \`roa\` int NOT NULL COMMENT 'Sector ROA'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`period_snapshot\` DROP COLUMN \`profit_rate\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`period_snapshot\` ADD \`profit_rate\` int NOT NULL COMMENT '총 수익률'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`period_snapshot\` DROP COLUMN \`profit\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`period_snapshot\` ADD \`profit\` int NOT NULL COMMENT '총 수익'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`period_snapshot\` DROP COLUMN \`sell_amount\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`period_snapshot\` ADD \`sell_amount\` int NOT NULL COMMENT '총 매도 금액'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`period_snapshot\` DROP COLUMN \`buy_amount\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`period_snapshot\` ADD \`buy_amount\` int NOT NULL COMMENT '총 매수 금액'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`period_snapshot\` DROP COLUMN \`carryover\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`period_snapshot\` ADD \`carryover\` int NOT NULL COMMENT '이월 원금'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`period_snapshot\` DROP COLUMN \`amount\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`period_snapshot\` ADD \`amount\` int NOT NULL COMMENT '투자 원금'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`sales_growth\` DROP COLUMN \`value\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`sales_growth\` ADD \`value\` int NOT NULL COMMENT '값'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`revenue_stock_analysis\` DROP COLUMN \`sales_growth_adjusted_rate\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`revenue_stock_analysis\` ADD \`sales_growth_adjusted_rate\` int NULL COMMENT 'Sales Growth 조정 비율'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`revenue_stock_analysis\` DROP COLUMN \`operating_margin\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`revenue_stock_analysis\` ADD \`operating_margin\` int NOT NULL COMMENT 'Operating Margin'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`revenue_stock_analysis\` DROP COLUMN \`ps\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`revenue_stock_analysis\` ADD \`ps\` int NOT NULL COMMENT 'P/S(FWD)'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`revenue_stock_analysis\` DROP COLUMN \`price\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`revenue_stock_analysis\` ADD \`price\` int NOT NULL COMMENT '주가'`,
		);
		await queryRunner.query(`ALTER TABLE \`eps_growth\` DROP COLUMN \`value\``);
		await queryRunner.query(
			`ALTER TABLE \`eps_growth\` ADD \`value\` int NOT NULL COMMENT '값'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`earning_stock_analysis\` DROP COLUMN \`eps_growth_adjusted_rate\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`earning_stock_analysis\` ADD \`eps_growth_adjusted_rate\` int NULL COMMENT 'EPS Growth 조정 비율'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`earning_stock_analysis\` DROP COLUMN \`roa\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`earning_stock_analysis\` ADD \`roa\` int NOT NULL COMMENT 'ROA'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`earning_stock_analysis\` DROP COLUMN \`pe\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`earning_stock_analysis\` ADD \`pe\` int NOT NULL COMMENT 'P/E'`,
		);
		await queryRunner.query(
			`ALTER TABLE \`earning_stock_analysis\` DROP COLUMN \`price\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`earning_stock_analysis\` ADD \`price\` int NOT NULL COMMENT '주가'`,
		);
	}
}
