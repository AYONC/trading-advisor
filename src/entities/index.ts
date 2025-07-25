import { EarningStockAnalysis } from './earning-stock-analysis.entity';
import { EpsGrowth } from './eps-growth.entity';
import { Period } from './period.entity';
import { PeriodSnapshot } from './period-snapshot.entity';
import { RevenueStockAnalysis } from './revenue-stock-analysis.entity';
import { SalesGrowth } from './sales-growth.entity';
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
