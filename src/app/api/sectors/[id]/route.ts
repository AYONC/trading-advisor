import { type NextRequest, NextResponse } from 'next/server';
import { Sector } from '@/entities/sector.entity';
import { Stock } from '@/entities/stock.entity';
import { getDataSource } from '@/lib/db';

interface RouteParams {
	params: {
		id: string;
	};
}

export async function GET(request: NextRequest, { params }: RouteParams) {
	try {
		const id = parseInt(params.id);

		if (isNaN(id)) {
			return NextResponse.json({ error: 'Invalid sector ID' }, { status: 400 });
		}

		const dataSource = await getDataSource();
		const sectorRepository = dataSource.getRepository(Sector);

		const sector = await sectorRepository.findOne({
			where: { id },
		});

		if (!sector) {
			return NextResponse.json({ error: 'Sector not found' }, { status: 404 });
		}

		return NextResponse.json(sector);
	} catch (error) {
		console.error('Error fetching sector:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
	try {
		const id = parseInt(params.id);

		if (isNaN(id)) {
			return NextResponse.json({ error: 'Invalid sector ID' }, { status: 400 });
		}

		const { name, description } = await request.json();

		// Validate required fields
		if (!name || !description) {
			return NextResponse.json(
				{ error: 'name and description are required' },
				{ status: 400 },
			);
		}

		const dataSource = await getDataSource();
		const sectorRepository = dataSource.getRepository(Sector);

		// Check if sector exists
		const sector = await sectorRepository.findOne({
			where: { id },
		});

		if (!sector) {
			return NextResponse.json({ error: 'Sector not found' }, { status: 404 });
		}

		// Check if name already exists (excluding current sector)
		const existingSector = await sectorRepository.findOne({
			where: { name: name.trim() },
		});

		if (existingSector && existingSector.id !== id) {
			return NextResponse.json(
				{ error: 'Sector with this name already exists' },
				{ status: 409 },
			);
		}

		// Update sector
		sector.name = name.trim();
		sector.description = description.trim();

		const updatedSector = await sectorRepository.save(sector);

		return NextResponse.json(updatedSector);
	} catch (error) {
		console.error('Error updating sector:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
	try {
		const id = parseInt(params.id);

		if (isNaN(id)) {
			return NextResponse.json({ error: 'Invalid sector ID' }, { status: 400 });
		}

		const dataSource = await getDataSource();
		const sectorRepository = dataSource.getRepository(Sector);
		const stockRepository = dataSource.getRepository(Stock);

		// Check if sector exists
		const sector = await sectorRepository.findOne({
			where: { id },
		});

		if (!sector) {
			return NextResponse.json({ error: 'Sector not found' }, { status: 404 });
		}

		// Check if any stocks are using this sector
		const stocksUsingThisSector = await stockRepository.count({
			where: { sectorId: id },
		});

		if (stocksUsingThisSector > 0) {
			return NextResponse.json(
				{
					error: `Cannot delete sector. ${stocksUsingThisSector} stocks are using this sector.`,
				},
				{ status: 409 },
			);
		}

		// Delete sector
		await sectorRepository.remove(sector);

		return NextResponse.json({ message: 'Sector deleted successfully' });
	} catch (error) {
		console.error('Error deleting sector:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}
