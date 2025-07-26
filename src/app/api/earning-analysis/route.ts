import { type NextRequest, NextResponse } from 'next/server';
import { EarningStockAnalysis } from '@/entities/analysis/earning-stock-analysis.entity';
import { Stock } from '@/entities/stock.entity';
import { getDataSource } from '@/lib/db';

export async function POST(request: NextRequest) {
	try {
		const dataSource = await getDataSource();
		const earningAnalysisRepository =
			dataSource.getRepository(EarningStockAnalysis);
		const stockRepository = dataSource.getRepository(Stock);

		const body = await request.json();
		const {
			stockId,
			period,
			price,
			pe,
			roa,
			epsRevisionGrade,
			epsGrowthAdjustedRate,
		} = body;

		// Validate required fields
		if (!stockId || !period || !price || !pe || !roa || !epsRevisionGrade) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
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

		// Validate EPS revision grade
		const validGrades = [
			'A+', 'A', 'A-', 
			'B+', 'B', 'B-', 
			'C+', 'C', 'C-', 
			'D+', 'D', 'D-', 
			'E'
		];
		if (!validGrades.includes(epsRevisionGrade)) {
			return NextResponse.json(
				{ error: 'Invalid EPS revision grade. Must be one of: A+, A, A-, B+, B, B-, C+, C, C-, D+, D, D-, E' },
				{ status: 400 },
			);
		}

		// Validate numeric ranges
		if (pe < 0 || pe > 1000) {
			return NextResponse.json(
				{ error: 'P/E ratio must be between 0 and 1000' },
				{ status: 400 },
			);
		}

		if (roa < 0 || roa > 1) {
			return NextResponse.json(
				{ error: 'ROA must be between 0 and 1' },
				{ status: 400 },
			);
		}

		// Check for duplicate analysis for the same stock and period
		const existingAnalysis = await earningAnalysisRepository.findOne({
			where: {
				stockId: stockId,
				period: period,
			},
		});

		if (existingAnalysis) {
			return NextResponse.json(
				{
					error: `Analysis for ${stock.ticker} in period ${period} already exists`,
				},
				{ status: 409 },
			);
		}

		// Create new earning analysis
		const earningAnalysis = earningAnalysisRepository.create({
			stockId,
			period,
			price,
			pe,
			roa,
			epsRevisionGrade,
			epsGrowthAdjustedRate: epsGrowthAdjustedRate || null,
		});

		const savedAnalysis = await earningAnalysisRepository.save(earningAnalysis);

		// Return the created analysis with stock information
		const analysisWithStock = await earningAnalysisRepository.findOne({
			where: { id: savedAnalysis.id },
			relations: ['stock'],
		});

		return NextResponse.json(analysisWithStock, { status: 201 });
	} catch (error) {
		console.error('Error creating earning analysis:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}

export async function GET(request: NextRequest) {
	try {
		const dataSource = await getDataSource();
		const earningAnalysisRepository =
			dataSource.getRepository(EarningStockAnalysis);

		// Get URL search parameters for filtering
		const { searchParams } = new URL(request.url);
		const stockId = searchParams.get('stockId');
		const period = searchParams.get('period');

		let whereCondition = {};

		if (stockId) {
			whereCondition = { ...whereCondition, stockId: Number(stockId) };
		}

		if (period) {
			whereCondition = { ...whereCondition, period: Number(period) };
		}

		const analyses = await earningAnalysisRepository.find({
			where:
				Object.keys(whereCondition).length > 0 ? whereCondition : undefined,
			relations: ['stock', 'stock.sector'],
			order: {
				period: 'DESC',
				createdAt: 'DESC',
			},
		});

		return NextResponse.json(analyses);
	} catch (error) {
		console.error('Error fetching earning analyses:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}
