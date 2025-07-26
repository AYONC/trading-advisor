'use client';

import {
	TableChart as TableChartIcon,
	ViewModule as ViewModuleIcon,
} from '@mui/icons-material';
import {
	Alert,
	Box,
	Button,
	ButtonGroup,
	CircularProgress,
	Container,
	Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import MarketChartView from './MarketChartView';
import MarketTableView from './MarketTableView';

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

type ViewType = 'table' | 'chart';

interface MarketDashboardProps {
	initialStocks: Stock[];
}

export default function MarketDashboard({
	initialStocks,
}: MarketDashboardProps) {
	const [stocksWithMarketData, setStocksWithMarketData] = useState<
		StockWithMarketData[]
	>(initialStocks.map((stock) => ({ ...stock, marketData: undefined })));
	const [marketDataLoading, setMarketDataLoading] = useState(false);
	const [viewType, setViewType] = useState<ViewType>('table');
	const [message, setMessage] = useState<{
		type: 'success' | 'error';
		text: string;
	} | null>(null);

	const fetchMarketData = useCallback(async (stocks: Stock[]) => {
		if (stocks.length === 0) return;

		try {
			setMarketDataLoading(true);
			setMessage(null);
			const tickers = stocks.map((stock) => stock.ticker);

			const response = await fetch('/api/yahoo-finance/batch', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					tickers,
					includHistorical: true,
					days: 7,
				}),
			});

			if (response.ok) {
				const marketData: YahooFinanceData[] = await response.json();

				// Combine stock data with market data
				const combined = stocks.map((stock) => {
					const marketInfo = marketData.find(
						(md) => md.ticker === stock.ticker,
					);
					return {
						...stock,
						marketData: marketInfo?.success ? marketInfo.data : undefined,
					};
				});

				setStocksWithMarketData(combined);
			} else {
				throw new Error('Failed to load market data');
			}
		} catch (error) {
			setMessage({
				type: 'error',
				text: 'Error loading market data from Yahoo Finance',
			});
			// Use stocks without market data
			setStocksWithMarketData(
				stocks.map((stock) => ({ ...stock, marketData: undefined })),
			);
		} finally {
			setMarketDataLoading(false);
		}
	}, []);

	useEffect(() => {
		if (initialStocks.length > 0) {
			fetchMarketData(initialStocks);
		}
	}, [initialStocks, fetchMarketData]);

	const handleStockClick = (ticker: string) => {
		window.open(`https://finance.yahoo.com/quote/${ticker}`, '_blank');
	};

	return (
		<Container maxWidth="lg">
			<Box sx={{ py: 4 }}>
				<Box sx={{ mb: 4 }}>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'flex-start',
							mb: 2,
						}}
					>
						<Box>
							<Typography variant="h4" component="h1" gutterBottom>
								Market Overview
							</Typography>
							<Typography variant="subtitle1" color="text.secondary">
								Real-time stock prices and 7-day price history. Click on any{' '}
								{viewType === 'table' ? 'row' : 'card'} to view on Yahoo
								Finance.
							</Typography>
						</Box>

						{/* View Type Toggle */}
						<ButtonGroup variant="outlined" size="small">
							<Button
								variant={viewType === 'table' ? 'contained' : 'outlined'}
								startIcon={<TableChartIcon />}
								onClick={() => setViewType('table')}
							>
								Table
							</Button>
							<Button
								variant={viewType === 'chart' ? 'contained' : 'outlined'}
								startIcon={<ViewModuleIcon />}
								onClick={() => setViewType('chart')}
							>
								Chart
							</Button>
						</ButtonGroup>
					</Box>

					{marketDataLoading && (
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
							<CircularProgress size={16} />
							<Typography variant="body2" color="text.secondary">
								Loading market data...
							</Typography>
						</Box>
					)}
				</Box>

				{message && (
					<Alert severity={message.type} sx={{ mb: 3 }}>
						{message.text}
					</Alert>
				)}

				{/* Render based on view type */}
				{viewType === 'table' ? (
					<MarketTableView
						stocksWithMarketData={stocksWithMarketData}
						loading={false}
						marketDataLoading={marketDataLoading}
						onStockClick={handleStockClick}
					/>
				) : (
					<MarketChartView
						stocksWithMarketData={stocksWithMarketData}
						marketDataLoading={marketDataLoading}
						onStockClick={handleStockClick}
					/>
				)}
			</Box>
		</Container>
	);
}
