import type { RevenueAnalysis, SalesGrowthData } from './types';

export interface ProcessedAnalysisData extends RevenueAnalysis {
	sales_growth_0?: number | null;
	sales_growth_1?: number | null;
	sales_growth_2?: number | null;
	sales_growth_avg: number | null;
	psg_ratio: number | null;
	growth_valuation: number | null;
	growth_valuation_price: number | null;
	growth_profitability_valuation: number | null;
	growth_profitability_valuation_price: number | null;
	upside_potential: number | null;
}

/**
 * Calculate Sales growth values for the first 3 years (+0, +1, +2)
 */
export function calculateSalesGrowthValues(
	salesGrowthData: SalesGrowthData[],
	sortedYears: number[],
): { [key: string]: number | null } {
	const salesGrowthValues: { [key: string]: number | null } = {};

	sortedYears.forEach((year, index) => {
		const growthData = salesGrowthData?.find((growth) => growth.year === year);
		salesGrowthValues[`sales_growth_${index}`] = growthData
			? growthData.value
			: null;
	});

	return salesGrowthValues;
}

/**
 * Calculate Sales growth average from displayed values
 */
export function calculateSalesGrowthAverage(
	salesGrowthData: SalesGrowthData[],
	sortedYears: number[],
): number | null {
	const displayedGrowthValues = sortedYears
		.map((year) => {
			const growthData = salesGrowthData?.find(
				(growth) => growth.year === year,
			);
			return growthData ? growthData.value : null;
		})
		.filter((value) => value !== null) as number[];

	if (displayedGrowthValues.length === 0) return null;

	const sum = displayedGrowthValues.reduce(
		(acc: number, val: number) => acc + Number(val),
		0,
	);
	return sum / displayedGrowthValues.length;
}

/**
 * Calculate PSG ratio (PS / Average Sales Growth / 100)
 */
export function calculatePsgRatio(
	ps: number,
	salesGrowthAvg: number | null,
): number | null {
	return salesGrowthAvg && salesGrowthAvg !== 0
		? ps / salesGrowthAvg / 100
		: null;
}

/**
 * Calculate 성장성 Valuation (PSR)
 */
export function calculateGrowthValuation(
	salesGrowthAdjustedRate: number,
	salesGrowthAvg: number,
	ps: number,
	sectorPsgRatio: number,
): number {
	return salesGrowthAdjustedRate
		? salesGrowthAdjustedRate * sectorPsgRatio * 100
		: salesGrowthAvg && salesGrowthAvg < 0
			? ps + ps * salesGrowthAvg
			: salesGrowthAvg * sectorPsgRatio * 100;
}

/**
 * Valuation 할인율
 */
export function calculateValuationDiscountRate(
	operatingMargin: number,
	sectorOperatingMargin: number,
): number | null {
	if (operatingMargin < sectorOperatingMargin) {
		return operatingMargin < 0
			? (operatingMargin + sectorOperatingMargin) / 2
			: (operatingMargin - sectorOperatingMargin) / 2;
	}
	return (operatingMargin - sectorOperatingMargin) / 2;
}

/**
 * Calculate 성장수익성 Valuation (PER)
 *
 */
export function calculateGrowthProfitabilityValuation(
	growthValuation: number,
	valuationDiscountRate: number,
): number | null {
	return growthValuation + growthValuation * valuationDiscountRate;
}

/**
 * Calculate 성장성 Valuation Price
 */
export function calculateGrowthValuationPrice(
	price: number,
	growthValuation: number,
	ps: number,
): number {
	return (price * growthValuation) / ps;
}

/**
 * Calculate 성장수익성 Valuation Price
 * =C2*Q2/D2
 */
export function calculateGrowthProfitabilityValuationPrice(
	price: number,
	growthProfitabilityValuation: number,
	ps: number,
): number {
	return (price * growthProfitabilityValuation) / ps;
}

/**
 * Calculate Upside Potential
 */
export function calculateUpsidePotential(
	growthProfitabilityValuationPrice: number | null,
	price: number,
): number | null {
	if (growthProfitabilityValuationPrice === null || price <= 0) return null;

	return growthProfitabilityValuationPrice / price - 1;
}

/**
 * Get sorted years (first 3) from all EPS growth data
 */
export function getSortedYears(analyses: RevenueAnalysis[]): number[] {
	const allYears = new Set<number>();
	analyses.forEach((analysis) => {
		analysis.salesGrowthData?.forEach((growth) => {
			allYears.add(growth.year);
		});
	});

	return Array.from(allYears).sort().slice(0, 3);
}

/**
 * Process all analyses data and add calculated fields
 */
export function processAnalysesData(
	analyses: RevenueAnalysis[],
): ProcessedAnalysisData[] {
	const sortedYears = getSortedYears(analyses);

	return analyses.map((analysis) => {
		// Calculate eps growth values for +0, +1, +2
		const salesGrowthValues = calculateSalesGrowthValues(
			analysis.salesGrowthData,
			sortedYears,
		);

		// Calculate eps growth average
		const salesGrowthAvg =
			calculateSalesGrowthAverage(analysis.salesGrowthData, sortedYears) ?? 0;

		// Calculate eps ratio (PE / Average EPS Growth / 100)
		const psgRatio = calculatePsgRatio(analysis.ps, salesGrowthAvg);

		// Calculate 성장성 Valuation (PER)
		const pegRatio = analysis.sectorRatio?.pegRatio || 1.0;
		const growthValuation = calculateGrowthValuation(
			analysis.salesGrowthAdjustedRate ?? 0,
			salesGrowthAvg,
			analysis.ps,
			analysis.sectorRatio?.psgRatio || 1.0,
		);

		// Calculate 성장성 Valuation Price
		const growthValuationPrice = calculateGrowthValuationPrice(
			analysis.price,
			growthValuation,
			analysis.ps,
		);

		const valuationDiscountRate = calculateValuationDiscountRate(
			Number(analysis.operatingMargin) ?? 0,
			Number(analysis.sectorRatio?.operatingMargin) ?? 0,
		);

		// Calculate 성장수익성 Valuation (PER)
		const growthProfitabilityValuation =
			calculateGrowthProfitabilityValuation(
				growthValuation,
				valuationDiscountRate ?? 0,
			) ?? 0;

		// Calculate 성장수익성 Valuation Price
		const growthProfitabilityValuationPrice =
			calculateGrowthProfitabilityValuationPrice(
				analysis.price,
				growthProfitabilityValuation,
				analysis.ps,
			);

		// Calculate Upside Potential
		const upsidePotential = calculateUpsidePotential(
			growthProfitabilityValuationPrice,
			analysis.price,
		);

		return {
			...analysis,
			...salesGrowthValues,
			sales_growth_avg: salesGrowthAvg,
			psg_ratio: psgRatio,
			growth_valuation: growthValuation,
			growth_valuation_price: growthValuationPrice,
			growth_profitability_valuation: growthProfitabilityValuation,
			growth_profitability_valuation_price: growthProfitabilityValuationPrice,
			upside_potential: upsidePotential,
		};
	});
}
