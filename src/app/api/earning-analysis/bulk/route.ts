import { type NextRequest, NextResponse } from 'next/server';
import { EarningStockAnalysis } from '@/entities/analysis/earning-stock-analysis.entity';
import { Stock } from '@/entities/stock.entity';
import { getDataSource } from '@/lib/db';

interface BulkAnalysisData {
	ticker: string;
	period: number;
	price: number;
	pe: number;
	roa: number;
	epsRevisionGrade: string;
	epsGrowthAdjustedRate?: number;
}

interface BulkResult {
	success: BulkAnalysisData[];
	errors: Array<{
		data: BulkAnalysisData;
		error: string;
	}>;
	total: number;
	successCount: number;
	errorCount: number;
}

export async function POST(request: NextRequest) {
	try {
		const { analyses }: { analyses: BulkAnalysisData[] } = await request.json();

		if (!analyses || !Array.isArray(analyses) || analyses.length === 0) {
			return NextResponse.json(
				{ error: 'Analyses array is required and must not be empty' },
				{ status: 400 },
			);
		}

		const dataSource = await getDataSource();
		const earningAnalysisRepository =
			dataSource.getRepository(EarningStockAnalysis);
		const stockRepository = dataSource.getRepository(Stock);

		// Get all stocks for ticker lookup
		const stocks = await stockRepository.find();
		const stockMap = new Map(
			stocks.map((stock) => [stock.ticker.toUpperCase(), stock]),
		);

		const validGrades = [
			'A+',
			'A',
			'A-',
			'B+',
			'B',
			'B-',
			'C+',
			'C',
			'C-',
			'D+',
			'D',
			'D-',
			'E',
		];
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
					analysisData.price === undefined ||
					analysisData.pe === undefined ||
					analysisData.roa === undefined ||
					!analysisData.epsRevisionGrade
				) {
					result.errors.push({
						data: analysisData,
						error:
							'Missing required fields (ticker, period, price, pe, roa, epsRevisionGrade)',
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

				// Find stock by ticker
				const stock = stockMap.get(analysisData.ticker.toUpperCase());
				if (!stock) {
					result.errors.push({
						data: analysisData,
						error: `Stock with ticker '${analysisData.ticker}' not found`,
					});
					continue;
				}

				// Validate EPS revision grade
				if (!validGrades.includes(analysisData.epsRevisionGrade)) {
					result.errors.push({
						data: analysisData,
						error: 'Invalid EPS revision grade. Must be A, B, C, D, or E',
					});
					continue;
				}

				// Validate numeric ranges
				if (analysisData.pe < 0 || analysisData.pe > 1000) {
					result.errors.push({
						data: analysisData,
						error: 'P/E ratio must be between 0 and 1000',
					});
					continue;
				}

				if (analysisData.roa < 0 || analysisData.roa > 1) {
					result.errors.push({
						data: analysisData,
						error: 'ROA must be between 0 and 1',
					});
					continue;
				}

				// Check for duplicate analysis for the same stock and period
				const existingAnalysis = await earningAnalysisRepository.findOne({
					where: {
						stockId: stock.id,
						period: analysisData.period,
					},
				});

				if (existingAnalysis) {
					result.errors.push({
						data: analysisData,
						error: `Analysis for ${analysisData.ticker} in period ${analysisData.period} already exists`,
					});
					continue;
				}

				// Create and save the analysis
				const earningAnalysis = earningAnalysisRepository.create({
					stock: { id: stock.id },
					period: analysisData.period,
					price: analysisData.price,
					pe: analysisData.pe,
					roa: analysisData.roa,
					epsRevisionGrade: analysisData.epsRevisionGrade,
					...(analysisData.epsGrowthAdjustedRate && {
						epsGrowthAdjustedRate: analysisData.epsGrowthAdjustedRate,
					}),
				});

				await earningAnalysisRepository.save(earningAnalysis);

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
		console.error('Error in bulk earning analysis creation:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}
