import { type NextRequest, NextResponse } from 'next/server';
import { EpsGrowth } from '@/entities/analysis/eps-growth.entity';
import { Stock } from '@/entities/stock.entity';
import { getDataSource } from '@/lib/db';

interface BulkEpsGrowthData {
	ticker: string;
	period: number;
	year: number;
	value: number;
}

interface BulkResult {
	success: BulkEpsGrowthData[];
	errors: Array<{
		data: BulkEpsGrowthData;
		error: string;
	}>;
	total: number;
	successCount: number;
	errorCount: number;
}

export async function POST(request: NextRequest) {
	try {
		const { analyses }: { analyses: BulkEpsGrowthData[] } =
			await request.json();

		if (!analyses || !Array.isArray(analyses) || analyses.length === 0) {
			return NextResponse.json(
				{ error: 'Analyses array is required and must not be empty' },
				{ status: 400 },
			);
		}

		const dataSource = await getDataSource();
		const epsGrowthRepository = dataSource.getRepository(EpsGrowth);
		const stockRepository = dataSource.getRepository(Stock);

		// Get all stocks for ticker lookup
		const stocks = await stockRepository.find();
		const stockMap = new Map(
			stocks.map((stock) => [stock.ticker.toUpperCase(), stock]),
		);

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
					!analysisData.period ||
					!analysisData.year ||
					analysisData.value === undefined
				) {
					result.errors.push({
						data: analysisData,
						error: 'Missing required fields (ticker, period, year, value)',
					});
					continue;
				}

				// Find stock by ticker
				const stock = stockMap.get(analysisData.ticker.toUpperCase());
				if (!stock) {
					result.errors.push({
						data: analysisData,
						error: `Stock with ticker '${analysisData.ticker}' not found`,
					});
					continue;
				}

				// Validate numeric ranges
				if (analysisData.period < 0 || !Number.isInteger(analysisData.period)) {
					result.errors.push({
						data: analysisData,
						error: 'Period must be an integer greater than or equal to 0',
					});
					continue;
				}

				if (analysisData.year < 1900 || analysisData.year > 2100) {
					result.errors.push({
						data: analysisData,
						error: 'Year must be between 1900 and 2100',
					});
					continue;
				}

				if (analysisData.value < -10 || analysisData.value > 10) {
					result.errors.push({
						data: analysisData,
						error: 'Value must be between -10 and 10',
					});
					continue;
				}

				// Check for duplicate analysis for the same stock, period, and year
				const existingGrowth = await epsGrowthRepository.findOne({
					where: {
						stockId: stock.id,
						period: analysisData.period,
						year: analysisData.year,
					},
				});

				if (existingGrowth) {
					result.errors.push({
						data: analysisData,
						error: `EPS Growth for ${analysisData.ticker} in period ${analysisData.period}, year ${analysisData.year} already exists`,
					});
					continue;
				}

				// Create and save the growth data
				const epsGrowth = epsGrowthRepository.create({
					stock: { id: stock.id },
					period: analysisData.period,
					year: analysisData.year,
					value: analysisData.value,
				});

				await epsGrowthRepository.save(epsGrowth);

				result.success.push(analysisData);
				result.successCount++;
			} catch (error) {
				result.errors.push({
					data: analysisData,
					error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
				});
			}
		}

		result.errorCount = result.errors.length;

		return NextResponse.json(result, {
			status: result.errorCount > 0 ? 207 : 201, // 207 Multi-Status if there are partial errors
		});
	} catch (error) {
		console.error('Error in bulk EPS Growth creation:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}
