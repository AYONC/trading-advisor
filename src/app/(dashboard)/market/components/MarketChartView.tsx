'use client';

import { ShowChart as ChartIcon } from '@mui/icons-material';
import { Box, Card, CardContent, Chip, Paper, Typography } from '@mui/material';
import {
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import { formatChange, formatPrice, getChangeColor, getChangeIcon } from './common';

interface Stock {
	id: number;
	ticker: string;
	companyName: string;
	sector: {
		id: number;
		name: string;
	};
}

interface YahooFinanceData {
	ticker: string;
	success: boolean;
	data?: {
		currentPrice?: number;
		priceChange?: number;
		priceChangePercent?: number;
		volume?: number;
		historical?: Array<{
			date: string;
			close: number;
			volume: number;
		}>;
	};
	error?: string;
}

interface StockWithMarketData extends Stock {
	marketData?: YahooFinanceData['data'];
}

interface MarketChartViewProps {
	stocksWithMarketData: StockWithMarketData[];
	marketDataLoading: boolean;
	onStockClick: (ticker: string) => void;
}

export default function MarketChartView({
	stocksWithMarketData,
	marketDataLoading,
	onStockClick,
}: MarketChartViewProps) {
	return (
		<Box
			sx={{
				display: 'flex',
				flexWrap: 'wrap',
				gap: 3,
				justifyContent: { xs: 'center', md: 'flex-start' },
			}}
		>
			{stocksWithMarketData.length === 0 ? (
				<Paper sx={{ p: 4, textAlign: 'center', width: '100%' }}>
					<Typography color="text.secondary">
						No stocks found. Add stocks to see market data!
					</Typography>
				</Paper>
			) : (
				stocksWithMarketData.map((stock) => (
					<Card
						key={stock.id}
						sx={{
							width: { xs: '100%', sm: '50%', md: '20%' },
							maxWidth: 400,
							cursor: 'pointer',
							transition: 'all 0.2s ease-in-out',
							'&:hover': {
								transform: 'translateY(-2px)',
								boxShadow: (theme) => theme.shadows[8],
							},
						}}
						onClick={() => onStockClick(stock.ticker)}
					>
						<CardContent>
							{/* Header */}
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'flex-start',
									mb: 2,
								}}
							>
								<Box sx={{ width: '100%' }}>
									<Typography variant="h6" component="h2" gutterBottom>
										{stock.ticker}
									</Typography>
									<Typography
										variant="body2"
										color="text.secondary"
										sx={{ mb: 1 }}
									>
										{stock.companyName}
									</Typography>
									<Chip
										label={stock.sector.name}
										size="small"
										color="secondary"
										variant="outlined"
									/>
								</Box>
								<ChartIcon color="action" />
							</Box>

							{/* Price Info */}
							<Box sx={{ mb: 2 }}>
								<Typography variant="h5" component="div" gutterBottom>
									{formatPrice(stock.marketData?.currentPrice)}
								</Typography>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
									{getChangeIcon(stock.marketData?.priceChange)}
									<Typography
										variant="body2"
										color={getChangeColor(stock.marketData?.priceChange)}
										fontWeight="medium"
									>
										{formatChange(
											stock.marketData?.priceChange,
											stock.marketData?.priceChangePercent,
										)}
									</Typography>
								</Box>
							</Box>

							{/* 7-Day Chart */}
							{stock.marketData?.historical &&
							stock.marketData.historical.length > 0 ? (
								<Box sx={{ height: 120, mt: 2 }}>
									<ResponsiveContainer width="100%" height="100%">
										<LineChart data={stock.marketData.historical}>
											<XAxis dataKey="date" hide />
											<YAxis hide />
											<Tooltip
												labelFormatter={(value) => `Date: ${value}`}
												formatter={(value: number) => [
													`$${value.toFixed(2)}`,
													'Price',
												]}
											/>
											<Line
												type="monotone"
												dataKey="close"
												stroke={
													stock.marketData?.priceChange &&
													stock.marketData.priceChange >= 0
														? '#4caf50'
														: '#f44336'
												}
												strokeWidth={2}
												dot={false}
												activeDot={{ r: 4 }}
											/>
										</LineChart>
									</ResponsiveContainer>
								</Box>
							) : (
								<Box
									sx={{
										height: 120,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<Typography variant="body2" color="text.secondary">
										{marketDataLoading
											? 'Loading chart...'
											: 'No chart data available'}
									</Typography>
								</Box>
							)}
						</CardContent>
					</Card>
				))
			)}
		</Box>
	);
}
