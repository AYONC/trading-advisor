import { type NextRequest, NextResponse } from 'next/server';
import { Sector } from '@/entities/sector.entity';
import { getDataSource } from '@/lib/db';

export async function GET() {
	try {
		const dataSource = await getDataSource();
		const sectorRepository = dataSource.getRepository(Sector);

		const sectors = await sectorRepository.find({
			order: { name: 'ASC' },
		});

		return NextResponse.json(sectors);
	} catch (error) {
		console.error('Error fetching sectors:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}

export async function POST(request: NextRequest) {
	try {
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

		// Check if sector name already exists
		const existingSector = await sectorRepository.findOne({
			where: { name: name.trim() },
		});

		if (existingSector) {
			return NextResponse.json(
				{ error: 'Sector with this name already exists' },
				{ status: 409 },
			);
		}

		// Create new sector
		const sector = sectorRepository.create({
			name: name.trim(),
			description: description.trim(),
		});

		const savedSector = await sectorRepository.save(sector);

		return NextResponse.json(savedSector, { status: 201 });
	} catch (error) {
		console.error('Error creating sector:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}
