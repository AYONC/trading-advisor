import { type NextRequest, NextResponse } from 'next/server';
import { Stock } from '@/entities/stock.entity';
import { getDataSource } from '@/lib/db';

export async function GET(request: NextRequest) {
	try {
		const dataSource = await getDataSource();
		const stockRepository = dataSource.getRepository(Stock);

		// Get all stocks from database only
		const stocks = await stockRepository.find({
			relations: ['sector'],
			order: { ticker: 'ASC' },
		});

		return NextResponse.json(stocks);
	} catch (error) {
		console.error('Error fetching stocks from database:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}
