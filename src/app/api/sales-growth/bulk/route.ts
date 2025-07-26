import { type NextRequest, NextResponse } from 'next/server';
import { SalesGrowth } from '@/entities/analysis/sales-growth.entity';
import { Stock } from '@/entities/stock.entity';
import { getDataSource } from '@/lib/db';

interface BulkSalesGrowthData {
	ticker: string;
	period: number;
	year: number;
	value: number;
}

interface BulkResult {
	success: Array<{
		data: BulkSalesGrowthData;
		result: SalesGrowth;
	}>;
	errors: Array<{
		data: BulkSalesGrowthData;
		error: string;
	}>;
	total: number;
	successCount: number;
	errorCount: number;
}

export async function POST(request: NextRequest) {
	try {
		const dataSource = await getDataSource();
		const salesGrowthRepository = dataSource.getRepository(SalesGrowth);
		const stockRepository = dataSource.getRepository(Stock);

		const { analyses }: { analyses: BulkSalesGrowthData[] } =
			await request.json();

		if (!Array.isArray(analyses) || analyses.length === 0) {
			return NextResponse.json(
				{ error: 'Invalid data: analyses must be a non-empty array' },
				{ status: 400 },
			);
		}

		const result: BulkResult = {
			success: [],
			errors: [],
			total: analyses.length,
			successCount: 0,
			errorCount: 0,
		};

		// Process each analysis
		for (const analysisData of analyses) {
			try {
				// Validate required fields
				if (
					!analysisData.ticker ||
					analysisData.period === undefined ||
					analysisData.year === undefined ||
					analysisData.value === undefined
				) {
					result.errors.push({
						data: analysisData,
						error: 'Missing required fields (ticker, period, year, value)',
					});
					continue;
				}

				// Validate period
				if (analysisData.period < 0 || !Number.isInteger(analysisData.period)) {
					result.errors.push({
						data: analysisData,
						error: 'Period must be an integer greater than or equal to 0',
					});
					continue;
				}

				// Validate year
				if (analysisData.year < 1900 || analysisData.year > 2100) {
					result.errors.push({
						data: analysisData,
						error: 'Year must be between 1900 and 2100',
					});
					continue;
				}

				// Find stock by ticker
				const stock = await stockRepository.findOne({
					where: { ticker: analysisData.ticker },
				});
				if (!stock) {
					result.errors.push({
						data: analysisData,
						error: `Stock with ticker ${analysisData.ticker} not found`,
					});
					continue;
				}

				// Check for duplicate
				const existingSalesGrowth = await salesGrowthRepository.findOne({
					where: {
						stockId: stock.id,
						period: analysisData.period,
						year: analysisData.year,
					},
				});
				if (existingSalesGrowth) {
					result.errors.push({
						data: analysisData,
						error: `Sales growth data already exists for ${analysisData.ticker} (period: ${analysisData.period}, year: ${analysisData.year})`,
					});
					continue;
				}

				// Create sales growth
				const salesGrowth = salesGrowthRepository.create({
					stock: { id: stock.id },
					period: analysisData.period,
					year: analysisData.year,
					value: analysisData.value,
				});

				await salesGrowthRepository.save(salesGrowth);

				result.success.push({
					data: analysisData,
					result: salesGrowth,
				});
			} catch (error) {
				result.errors.push({
					data: analysisData,
					error: `Failed to create sales growth: ${error instanceof Error ? error.message : 'Unknown error'}`,
				});
			}
		}

		result.successCount = result.success.length;
		result.errorCount = result.errors.length;

		// Return appropriate status based on results
		if (result.errorCount === 0) {
			return NextResponse.json(result, { status: 201 });
		} else if (result.successCount === 0) {
			return NextResponse.json(result, { status: 400 });
		} else {
			return NextResponse.json(result, { status: 207 }); // Multi-status
		}
	} catch (error) {
		console.error('Error in bulk sales growth creation:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}
