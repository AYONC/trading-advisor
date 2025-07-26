import { type NextRequest, NextResponse } from 'next/server';
import { SalesGrowth } from '@/entities/analysis/sales-growth.entity';
import { Stock } from '@/entities/stock.entity';
import { getDataSource } from '@/lib/db';

export async function POST(request: NextRequest) {
	try {
		const dataSource = await getDataSource();
		const salesGrowthRepository = dataSource.getRepository(SalesGrowth);
		const stockRepository = dataSource.getRepository(Stock);

		const body = await request.json();
		const { stockId, period, year, value } = body;

		// Validate required fields
		if (
			!stockId ||
			period === undefined ||
			year === undefined ||
			value === undefined
		) {
			return NextResponse.json(
				{ error: 'Missing required fields (stockId, period, year, value)' },
				{ status: 400 },
			);
		}

		// Validate period
		if (period < 0 || !Number.isInteger(period)) {
			return NextResponse.json(
				{ error: 'Period must be an integer greater than or equal to 0' },
				{ status: 400 },
			);
		}

		// Validate year
		if (year < 1900 || year > 2100) {
			return NextResponse.json(
				{ error: 'Year must be between 1900 and 2100' },
				{ status: 400 },
			);
		}

		// Validate that stock exists
		const stock = await stockRepository.findOne({ where: { id: stockId } });
		if (!stock) {
			return NextResponse.json({ error: 'Stock not found' }, { status: 404 });
		}

		// Check for duplicate
		const existingSalesGrowth = await salesGrowthRepository.findOne({
			where: { stockId, period, year },
		});
		if (existingSalesGrowth) {
			return NextResponse.json(
				{
					error:
						'Sales growth data already exists for this stock, period, and year',
				},
				{ status: 409 },
			);
		}

		// Create sales growth
		const salesGrowth = salesGrowthRepository.create({
			stock: { id: stock.id },
			period,
			year,
			value,
		});

		const savedGrowth = await salesGrowthRepository.save(salesGrowth);

		// Return with stock information
		const result = await salesGrowthRepository.findOne({
			where: { id: savedGrowth.id },
			relations: ['stock', 'stock.sector'],
		});

		return NextResponse.json(result);
	} catch (error) {
		console.error('Error creating sales growth:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}

export async function GET(request: NextRequest) {
	try {
		const dataSource = await getDataSource();
		const salesGrowthRepository = dataSource.getRepository(SalesGrowth);

		const { searchParams } = new URL(request.url);
		const stockId = searchParams.get('stockId');
		const period = searchParams.get('period');
		const year = searchParams.get('year');

		let whereCondition = {};

		if (stockId) {
			whereCondition = { ...whereCondition, stockId: Number(stockId) };
		}
		if (period) {
			whereCondition = { ...whereCondition, period: Number(period) };
		}
		if (year) {
			whereCondition = { ...whereCondition, year: Number(year) };
		}

		const salesGrowthData = await salesGrowthRepository.find({
			where:
				Object.keys(whereCondition).length > 0 ? whereCondition : undefined,
			relations: ['stock', 'stock.sector'],
			order: { period: 'DESC', year: 'DESC', createdAt: 'DESC' },
		});

		return NextResponse.json(salesGrowthData);
	} catch (error) {
		console.error('Error fetching sales growth:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}
