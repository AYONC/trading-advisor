'use server';

import { type NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/db';

export async function GET(
	_request: NextRequest,
	{ params }: { params: { week: string } },
) {
	const weekNumber = parseInt(params.week);

	try {
		const dataSource = await getDataSource();

		const query = `
      SELECT 
        (last_snapshot.cash_balance + 
         COALESCE(sell_trades.sell_amount, 0) - 
         COALESCE(buy_trades.buy_amount, 0)) as current_cash_balance
      FROM weekly_snapshots last_snapshot
      LEFT JOIN (
        SELECT SUM(total_amount) as sell_amount
        FROM trade_orders 
        WHERE week_number = ? AND action = 'sell' AND status = 'completed'
      ) sell_trades ON 1=1
      LEFT JOIN (
        SELECT SUM(total_amount) as buy_amount
        FROM trade_orders 
        WHERE week_number = ? AND action = 'buy' AND status = 'completed'
      ) buy_trades ON 1=1
      WHERE last_snapshot.week_number = ?
      ORDER BY last_snapshot.snapshot_id DESC 
      LIMIT 1
    `;

		const result = await dataSource.query(query, [
			weekNumber,
			weekNumber,
			weekNumber - 1,
		]);
		return NextResponse.json({
			cash_balance: result[0]?.current_cash_balance || 0,
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: 'Database error' }, { status: 500 });
	}
}
