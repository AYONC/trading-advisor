import { type NextRequest, NextResponse } from 'next/server';
import { Sector } from '@/entities/sector.entity';
import { Stock } from '@/entities/stock.entity';
import { getDataSource } from '@/lib/db';

export async function POST(request: NextRequest) {
	try {
		const { ticker, companyName, sectorId } = await request.json();

		// Validate required fields
		if (!ticker || !companyName || !sectorId) {
			return NextResponse.json(
				{ error: 'ticker, companyName, and sectorId are required' },
				{ status: 400 },
			);
		}

		const dataSource = await getDataSource();
		const stockRepository = dataSource.getRepository(Stock);
		const sectorRepository = dataSource.getRepository(Sector);

		// Check if ticker already exists
		const existingStock = await stockRepository.findOne({
			where: { ticker: ticker.toUpperCase() },
		});

		if (existingStock) {
			return NextResponse.json(
				{ error: 'Stock with this ticker already exists' },
				{ status: 409 },
			);
		}

		// Verify sector exists
		const sector = await sectorRepository.findOne({
			where: { id: sectorId },
		});

		if (!sector) {
			return NextResponse.json({ error: 'Sector not found' }, { status: 404 });
		}

		// Create new stock
		const stock = stockRepository.create({
			ticker: ticker.toUpperCase(),
			companyName,
			sectorId,
		});

		const savedStock = await stockRepository.save(stock);

		// Return created stock with sector information
		const stockWithSector = await stockRepository.findOne({
			where: { id: savedStock.id },
			relations: ['sector'],
		});

		return NextResponse.json(stockWithSector, { status: 201 });
	} catch (error) {
		console.error('Error creating stock:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}

export async function GET() {
	try {
		const dataSource = await getDataSource();
		const stockRepository = dataSource.getRepository(Stock);

		const stocks = await stockRepository.find({
			relations: ['sector'],
			order: { ticker: 'ASC' },
		});

		return NextResponse.json(stocks);
	} catch (error) {
		console.error('Error fetching stocks:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}
