
export interface Stock {
	id: number;
	ticker: string;
	companyName: string;
	sector: {
		id: number;
		name: string;
	};
}

export interface EpsGrowthData {
	id: number;
	period: number;
	year: number;
	value: number;
	createdAt: string;
	updatedAt: string;
}

export interface SectorRatio {
	id: number;
	sectorId: number;
	period: number;
	roa: number;
	pegRatio: number;
	psgRatio: number;
	operatingMargin: number;
	createdAt: string;
	updatedAt: string;
}

export interface EarningAnalysis {
	id: number;
	period: number;
	price: number;
	pe: number;
	roa: number;
	epsRevisionGrade: string;
	epsGrowthAdjustedRate?: number;
	createdAt: string;
	updatedAt: string;
	stock: Stock;
	epsGrowthData: EpsGrowthData[];
	sectorRatio?: SectorRatio;
}

export interface PaginationInfo {
	current: number;
	total: number;
	limit: number;
	totalItems: number;
	hasNext: boolean;
	hasPrev: boolean;
}

export interface EarningAnalysisApiResponse {
	data: EarningAnalysis[];
	pagination: PaginationInfo;
}
