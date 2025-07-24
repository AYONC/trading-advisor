'use server';
import { type NextRequest, NextResponse } from 'next/server';
import type { DataSource } from 'typeorm';
import { WeeklySnapshot } from '@/entities/weekly-snapshot.entity';
import { getDataSource } from '@/lib/db';

export async function GET(
	_request: NextRequest,
	{ params }: { params: { week: string } },
) {
	const weekNumber = parseInt(params.week);

	try {
		const dataSource = await getDataSource();
		const currentWeek = getCurrentWeek();

		if (weekNumber === currentWeek) {
			// 현재 주차: 실시간 계산
			const portfolio = await getCurrentPortfolio(dataSource, weekNumber);
			return NextResponse.json(portfolio);
		} else {
			// 과거 주차: 스냅샷 조회
			const snapshotRepo = dataSource.getRepository(WeeklySnapshot);
			const snapshot = await snapshotRepo.findOne({
				where: { weekNumber: weekNumber },
				relations: ['holdings'],
			});
			return NextResponse.json(snapshot);
		}
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: 'Database error' }, { status: 500 });
	}
}

async function getCurrentPortfolio(dataSource: DataSource, weekNumber: number) {
	const query = `
    SELECT 
      ticker,
      (COALESCE(last_holdings.shares, 0) + 
       COALESCE(buy_trades.buy_shares, 0) - 
       COALESCE(sell_trades.sell_shares, 0)) as current_shares
    FROM (
      SELECT DISTINCT ticker FROM snapshot_holdings sh
      JOIN weekly_snapshots ws ON sh.snapshot_id = ws.snapshot_id
      WHERE ws.week_number = ?
      UNION
      SELECT DISTINCT ticker FROM trade_orders
      WHERE week_number = ? AND status = 'completed'
    ) tickers
    LEFT JOIN (
      SELECT sh.ticker, sh.shares
      FROM snapshot_holdings sh
      JOIN weekly_snapshots ws ON sh.snapshot_id = ws.snapshot_id  
      WHERE ws.week_number = ?
    ) last_holdings ON tickers.ticker = last_holdings.ticker
    LEFT JOIN (
      SELECT ticker, SUM(shares) as buy_shares
      FROM trade_orders
      WHERE week_number = ? AND action = 'buy' AND status = 'completed'
      GROUP BY ticker
    ) buy_trades ON tickers.ticker = buy_trades.ticker
    LEFT JOIN (
      SELECT ticker, SUM(shares) as sell_shares  
      FROM trade_orders
      WHERE week_number = ? AND action = 'sell' AND status = 'completed'
      GROUP BY ticker
    ) sell_trades ON tickers.ticker = sell_trades.ticker
    HAVING current_shares > 0
  `;

	return await dataSource.query(query, [
		weekNumber - 1,
		weekNumber,
		weekNumber - 1,
		weekNumber,
		weekNumber,
	]);
}

function getCurrentWeek(): number {
	const now = new Date();
	const start = new Date(now.getFullYear(), 0, 1);
	const week = Math.ceil(
		((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7,
	);
	return week;
}
