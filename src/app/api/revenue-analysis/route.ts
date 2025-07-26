import { type NextRequest, NextResponse } from 'next/server';
import { RevenueStockAnalysis } from '@/entities/analysis/revenue-stock-analysis.entity';
import { Stock } from '@/entities/stock.entity';
import { getDataSource } from '@/lib/db';

export async function POST(request: NextRequest) {
	try {
		const dataSource = await getDataSource();
		const revenueAnalysisRepository =
			dataSource.getRepository(RevenueStockAnalysis);
		const stockRepository = dataSource.getRepository(Stock);

		const body = await request.json();
		const {
			stockId,
			period,
			price,
			ps,
			operatingMargin,
			salesGrowthAdjustedRate,
		} = body;

		// Validate required fields
		if (
			!stockId ||
			period === undefined ||
			price === undefined ||
			ps === undefined ||
			operatingMargin === undefined
		) {
			return NextResponse.json(
				{
					error:
						'Missing required fields (stockId, period, price, ps, operatingMargin)',
				},
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

		// Validate that stock exists
		const stock = await stockRepository.findOne({
			where: { id: stockId },
		});

		if (!stock) {
			return NextResponse.json({ error: 'Stock not found' }, { status: 404 });
		}

		// Validate numeric ranges
		if (price < 0) {
			return NextResponse.json(
				{ error: 'Price must be positive' },
				{ status: 400 },
			);
		}

		if (ps < 0) {
			return NextResponse.json(
				{ error: 'P/S ratio must be positive' },
				{ status: 400 },
			);
		}

		if (operatingMargin < -1 || operatingMargin > 1) {
			return NextResponse.json(
				{ error: 'Operating Margin must be between -1 and 1' },
				{ status: 400 },
			);
		}

		if (
			salesGrowthAdjustedRate !== undefined &&
			salesGrowthAdjustedRate !== null
		) {
			if (salesGrowthAdjustedRate < -1 || salesGrowthAdjustedRate > 10) {
				return NextResponse.json(
					{ error: 'Sales Growth Adjusted Rate must be between -1 and 10' },
					{ status: 400 },
				);
			}
		}

		// Check for duplicate analysis for the same stock and period
		const existingAnalysis = await revenueAnalysisRepository.findOne({
			where: {
				stockId: stockId,
				period: period,
			},
		});

		if (existingAnalysis) {
			return NextResponse.json(
				{
					error: `Revenue analysis for ${stock.ticker} in period ${period} already exists`,
				},
				{ status: 409 },
			);
		}

		// Create new revenue analysis
		const revenueAnalysis = revenueAnalysisRepository.create({
			stock: { id: stock.id },
			period,
			price,
			ps,
			operatingMargin,
			...(salesGrowthAdjustedRate !== undefined &&
				salesGrowthAdjustedRate !== null && {
					salesGrowthAdjustedRate,
				}),
		});

		const savedAnalysis = await revenueAnalysisRepository.save(revenueAnalysis);

		// Return the created analysis with stock information
		const analysisWithStock = await revenueAnalysisRepository.findOne({
			where: { id: savedAnalysis.id },
			relations: ['stock'],
		});

		return NextResponse.json(analysisWithStock, { status: 201 });
	} catch (error) {
		console.error('Error creating revenue analysis:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}

export async function GET(request: NextRequest) {
	try {
		const dataSource = await getDataSource();
		const revenueAnalysisRepository =
			dataSource.getRepository(RevenueStockAnalysis);

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

		const analyses = await revenueAnalysisRepository.find({
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
		console.error('Error fetching revenue analyses:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}
