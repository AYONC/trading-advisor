import { type NextRequest, NextResponse } from 'next/server';
import { EpsGrowth } from '@/entities/analysis/eps-growth.entity';
import { Stock } from '@/entities/stock.entity';
import { getDataSource } from '@/lib/db';

export async function POST(request: NextRequest) {
	try {
		const dataSource = await getDataSource();
		const epsGrowthRepository = dataSource.getRepository(EpsGrowth);
		const stockRepository = dataSource.getRepository(Stock);

		const body = await request.json();
		const { stockId, period, year, value } = body;

		// Validate required fields
		if (!stockId || !period || !year || value === undefined) {
			return NextResponse.json(
				{ error: 'Missing required fields (stockId, period, year, value)' },
				{ status: 400 },
			);
		}

		// Validate that stock exists
		const stock = await stockRepository.findOne({
			where: { id: stockId },
		});

		if (!stock) {
			return NextResponse.json({ error: 'Stock not found' }, { status: 404 });
		}

		// Validate numeric ranges
		if (period < 0 || !Number.isInteger(period)) {
			return NextResponse.json(
				{ error: 'Period must be an integer greater than or equal to 0' },
				{ status: 400 },
			);
		}

		if (year < 1900 || year > 2100) {
			return NextResponse.json(
				{ error: 'Year must be between 1900 and 2100' },
				{ status: 400 },
			);
		}

		if (value < -10 || value > 10) {
			return NextResponse.json(
				{ error: 'Value must be between -10 and 10' },
				{ status: 400 },
			);
		}

		// Check for duplicate analysis for the same stock, period, and year
		const existingGrowth = await epsGrowthRepository.findOne({
			where: {
				stockId: stockId,
				period: period,
				year: year,
			},
		});

		if (existingGrowth) {
			return NextResponse.json(
				{
					error: `EPS Growth for ${stock.ticker} in period ${period}, year ${year} already exists`,
				},
				{ status: 409 },
			);
		}

		// Create new EPS Growth
		const epsGrowth = epsGrowthRepository.create({
			stock: { id: stock.id },
			period,
			year,
			value,
		});

		const savedGrowth = await epsGrowthRepository.save(epsGrowth);

		// Return the created growth with stock information
		const growthWithStock = await epsGrowthRepository.findOne({
			where: { id: savedGrowth.id },
			relations: ['stock'],
		});

		return NextResponse.json(growthWithStock, { status: 201 });
	} catch (error) {
		console.error('Error creating EPS Growth:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}

export async function GET(request: NextRequest) {
	try {
		const dataSource = await getDataSource();
		const epsGrowthRepository = dataSource.getRepository(EpsGrowth);

		// Get URL search parameters for filtering
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

		const growthData = await epsGrowthRepository.find({
			where:
				Object.keys(whereCondition).length > 0 ? whereCondition : undefined,
			relations: ['stock', 'stock.sector'],
			order: {
				year: 'DESC',
				period: 'DESC',
				createdAt: 'DESC',
			},
		});

		return NextResponse.json(growthData);
	} catch (error) {
		console.error('Error fetching EPS Growth data:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}
