export interface Stock {
	id: number;
	ticker: string;
	companyName: string;
	sector: {
		id: number;
		name: string;
	};
}

export interface SalesGrowthData {
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

export interface RevenueAnalysis {
	stock: Stock;
	id: number;
	period: number;
	price: number;
	ps: number;
	operatingMargin: number;
	salesGrowthAdjustedRate?: number;
	createdAt: string;
	updatedAt: string;
	salesGrowthData: SalesGrowthData[];
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

export interface RevenueAnalysisApiResponse {
	data: RevenueAnalysis[];
	pagination: PaginationInfo;
}
