import { EarningStockAnalysis } from './analysis/earning-stock-analysis.entity';
import { EpsGrowth } from './analysis/eps-growth.entity';
import { RevenueStockAnalysis } from './analysis/revenue-stock-analysis.entity';
import { SalesGrowth } from './analysis/sales-growth.entity';
import { Period } from './period.entity';
import { PeriodSnapshot } from './period-snapshot.entity';
import { Sector } from './sector.entity';
import { SectorRatio } from './sector-ratio.entity';
import { SnapshotStock } from './snapshot-stock.entity';
import { Stock } from './stock.entity';
import { TradeOrder } from './trade-order.entity';

export const entities = [
	Sector,
	SectorRatio,
	Stock,
	Period,
	PeriodSnapshot,
	SnapshotStock,
	EarningStockAnalysis,
	RevenueStockAnalysis,
	SalesGrowth,
	EpsGrowth,
	TradeOrder,
];
