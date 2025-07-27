import type { EarningAnalysis, EpsGrowthData } from './page';

export interface ProcessedAnalysisData extends EarningAnalysis {
	eps_growth_0?: number | null;
	eps_growth_1?: number | null;
	eps_growth_2?: number | null;
	eps_growth_avg: number | null;
	eps_ratio: number | null;
	growth_valuation: number | null;
	growth_valuation_price: number | null;
	growth_profitability_valuation: number | null;
	growth_profitability_valuation_price: number | null;
	upside_potential: number | null;
}

/**
 * Calculate EPS growth values for the first 3 years (+0, +1, +2)
 */
export function calculateEpsGrowthValues(
	epsGrowthData: EpsGrowthData[],
	sortedYears: number[],
): { [key: string]: number | null } {
	const epsGrowthValues: { [key: string]: number | null } = {};

	sortedYears.forEach((year, index) => {
		const growthData = epsGrowthData?.find((growth) => growth.year === year);
		epsGrowthValues[`eps_growth_${index}`] = growthData
			? growthData.value
			: null;
	});

	return epsGrowthValues;
}

/**
 * Calculate EPS growth average from displayed values
 */
export function calculateEpsGrowthAverage(
	epsGrowthData: EpsGrowthData[],
	sortedYears: number[],
): number | null {
	const displayedGrowthValues = sortedYears
		.map((year) => {
			const growthData = epsGrowthData?.find((growth) => growth.year === year);
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
 * Calculate EPS ratio (PE / Average EPS Growth / 100)
 */
export function calculateEpsRatio(
	pe: number,
	epsGrowthAvg: number | null,
): number | null {
	return epsGrowthAvg && epsGrowthAvg !== 0 ? pe / epsGrowthAvg / 100 : null;
}

/**
 * Calculate 성장성 Valuation (PER)
 */
export function calculateGrowthValuation(
	epsGrowthAdjustedRate: number | undefined,
	epsGrowthAvg: number | null,
	pegRatio: number,
): number | null {
	return epsGrowthAdjustedRate
		? epsGrowthAdjustedRate * pegRatio * 100
		: epsGrowthAvg
			? epsGrowthAvg * pegRatio * 100
			: null;
}

/**
 * Calculate 성장성 Valuation Price
 */
export function calculateGrowthValuationPrice(
	price: number,
	growthValuation: number | null,
	pe: number,
): number | null {
	if (growthValuation === null) return null;

	const calculatedPrice = (price * growthValuation) / pe;
	return calculatedPrice > 0 ? calculatedPrice : price * 0.9;
}

/**
 * Calculate 성장수익성 Valuation (PER)
 * Formula: x * y where
 * x = growth adjusted eps ? growth adjusted eps * 100 * sector_peg_ratio : average_eps_growth * 100 * sector_peg_ratio
 * y = min(1.3, max(0.7, roa > sector_roa ? 1 + ln(1 + (roa - sector_roa)) : 1 - ln(1 + (sector_roa - roa))))
 */
export function calculateGrowthProfitabilityValuation(
	epsGrowthAdjustedRate: number | undefined,
	epsGrowthAvg: number | null,
	pegRatio: number,
	currentRoa: number,
	sectorRoa: number,
): number | null {
	// Calculate x
	const x = epsGrowthAdjustedRate
		? epsGrowthAdjustedRate * 100 * pegRatio
		: epsGrowthAvg
			? epsGrowthAvg * 100 * pegRatio
			: null;

	if (x === null) return null;

	// Calculate y (profitability adjustment factor)
	const y = Math.min(
		1.3,
		Math.max(
			0.7,
			currentRoa > sectorRoa
				? 1 + Math.log(1 + (currentRoa - sectorRoa))
				: 1 - Math.log(1 + (sectorRoa - currentRoa)),
		),
	);

	// Return x * y
	return x * y;
}

/**
 * Calculate 성장수익성 Valuation Price
 */
export function calculateGrowthProfitabilityValuationPrice(
	price: number,
	growthProfitabilityValuation: number | null,
	pe: number,
): number | null {
	if (growthProfitabilityValuation === null) return null;

	const calculatedPrice = (price * growthProfitabilityValuation) / pe;
	return calculatedPrice < 0 ? price * 0.9 : calculatedPrice;
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
export function getSortedYears(analyses: EarningAnalysis[]): number[] {
	const allYears = new Set<number>();
	analyses.forEach((analysis) => {
		analysis.epsGrowthData?.forEach((growth) => {
			allYears.add(growth.year);
		});
	});

	return Array.from(allYears).sort().slice(0, 3);
}

/**
 * Process all analyses data and add calculated fields
 */
export function processAnalysesData(
	analyses: EarningAnalysis[],
): ProcessedAnalysisData[] {
	const sortedYears = getSortedYears(analyses);

	return analyses.map((analysis) => {
		// Calculate eps growth values for +0, +1, +2
		const epsGrowthValues = calculateEpsGrowthValues(
			analysis.epsGrowthData,
			sortedYears,
		);

		// Calculate eps growth average
		const epsGrowthAvg = calculateEpsGrowthAverage(
			analysis.epsGrowthData,
			sortedYears,
		);

		// Calculate eps ratio (PE / Average EPS Growth / 100)
		const epsRatio = calculateEpsRatio(analysis.pe, epsGrowthAvg);

		// Calculate 성장성 Valuation (PER)
		const pegRatio = analysis.sectorRatio?.pegRatio || 1.0;
		const growthValuation = calculateGrowthValuation(
			analysis.epsGrowthAdjustedRate,
			epsGrowthAvg,
			pegRatio,
		);

		// Calculate 성장성 Valuation Price
		const growthValuationPrice = calculateGrowthValuationPrice(
			analysis.price,
			growthValuation,
			analysis.pe,
		);

		// Calculate 성장수익성 Valuation (PER)
		const growthProfitabilityValuation =
			analysis.sectorRatio?.roa !== undefined
				? calculateGrowthProfitabilityValuation(
						analysis.epsGrowthAdjustedRate,
						epsGrowthAvg,
						pegRatio,
						analysis.roa,
						analysis.sectorRatio.roa,
					)
				: null;

		// Calculate 성장수익성 Valuation Price
		const growthProfitabilityValuationPrice =
			calculateGrowthProfitabilityValuationPrice(
				analysis.price,
				growthProfitabilityValuation,
				analysis.pe,
			);

		// Calculate Upside Potential
		const upsidePotential = calculateUpsidePotential(
			growthProfitabilityValuationPrice,
			analysis.price,
		);

		return {
			...analysis,
			...epsGrowthValues,
			eps_growth_avg: epsGrowthAvg,
			eps_ratio: epsRatio,
			growth_valuation: growthValuation,
			growth_valuation_price: growthValuationPrice,
			growth_profitability_valuation: growthProfitabilityValuation,
			growth_profitability_valuation_price: growthProfitabilityValuationPrice,
			upside_potential: upsidePotential,
		};
	});
}
