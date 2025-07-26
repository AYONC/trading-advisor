import { type NextRequest, NextResponse } from 'next/server';
import { RevenueStockAnalysis } from '@/entities/analysis/revenue-stock-analysis.entity';
import { Stock } from '@/entities/stock.entity';
import { getDataSource } from '@/lib/db';

interface BulkRevenueAnalysisData {
	ticker: string;
	period: number;
	price: number;
	ps: number;
	operatingMargin: number;
	salesGrowthAdjustedRate?: number;
}

interface BulkResult {
	success: BulkRevenueAnalysisData[];
	errors: Array<{
		data: BulkRevenueAnalysisData;
		error: string;
	}>;
	total: number;
	successCount: number;
	errorCount: number;
}

export async function POST(request: NextRequest) {
	try {
		const { analyses }: { analyses: BulkRevenueAnalysisData[] } =
			await request.json();

		if (!analyses || !Array.isArray(analyses) || analyses.length === 0) {
			return NextResponse.json(
				{ error: 'Analyses array is required and must not be empty' },
				{ status: 400 },
			);
		}

		const dataSource = await getDataSource();
		const revenueAnalysisRepository =
			dataSource.getRepository(RevenueStockAnalysis);
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
					analysisData.price === undefined ||
					analysisData.ps === undefined ||
					analysisData.operatingMargin === undefined
				) {
					result.errors.push({
						data: analysisData,
						error:
							'Missing required fields (ticker, period, price, ps, operatingMargin)',
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
				if (analysisData.price < 0) {
					result.errors.push({
						data: analysisData,
						error: 'Price must be positive',
					});
					continue;
				}

				if (analysisData.ps < 0) {
					result.errors.push({
						data: analysisData,
						error: 'P/S ratio must be positive',
					});
					continue;
				}

				if (
					analysisData.operatingMargin < -1 ||
					analysisData.operatingMargin > 1
				) {
					result.errors.push({
						data: analysisData,
						error: 'Operating Margin must be between -1 and 1',
					});
					continue;
				}

				if (
					analysisData.salesGrowthAdjustedRate !== undefined &&
					(analysisData.salesGrowthAdjustedRate < -1 ||
						analysisData.salesGrowthAdjustedRate > 10)
				) {
					result.errors.push({
						data: analysisData,
						error: 'Sales Growth Adjusted Rate must be between -1 and 10',
					});
					continue;
				}

				// Check for duplicate analysis for the same stock and period
				const existingAnalysis = await revenueAnalysisRepository.findOne({
					where: {
						stockId: stock.id,
						period: analysisData.period,
					},
				});

				if (existingAnalysis) {
					result.errors.push({
						data: analysisData,
						error: `Revenue analysis for ${analysisData.ticker} in period ${analysisData.period} already exists`,
					});
					continue;
				}

				// Create and save the analysis
				const revenueAnalysis = revenueAnalysisRepository.create({
					stock: { id: stock.id },
					period: analysisData.period,
					price: analysisData.price,
					ps: analysisData.ps,
					operatingMargin: analysisData.operatingMargin,
					...(analysisData.salesGrowthAdjustedRate !== undefined && {
						salesGrowthAdjustedRate: analysisData.salesGrowthAdjustedRate,
					}),
				});

				await revenueAnalysisRepository.save(revenueAnalysis);

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
		console.error('Error in bulk revenue analysis creation:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}
