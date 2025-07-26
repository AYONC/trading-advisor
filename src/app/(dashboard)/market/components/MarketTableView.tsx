'use client';

import { Box, Chip, Paper, Typography } from '@mui/material';
import {
	DataGrid,
	type GridCellParams,
	type GridColDef,
	type GridRowsProp,
} from '@mui/x-data-grid';
import {
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import { gray } from '@/theme/themePrimitives';
import { formatPrice, getChangeColor, getChangeIcon } from './common';

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

interface MarketTableViewProps {
	stocksWithMarketData: StockWithMarketData[];
	loading: boolean;
	marketDataLoading: boolean;
	onStockClick: (ticker: string) => void;
}

// DataGrid columns configuration
const columns: GridColDef[] = [
	{
		field: 'ticker',
		headerName: 'Ticker',
		width: 120,
		align: 'center',
		headerAlign: 'center',
		renderCell: (params: GridCellParams) => (
			<Typography variant="body2" fontWeight="bold">
				{params.value as string}
			</Typography>
		),
	},
	{
		field: 'companyName',
		headerName: 'Company Name',
		flex: 1,
		minWidth: 200,
		align: 'left',
		headerAlign: 'center',
		renderCell: (params: GridCellParams) => params.value as string,
	},
	{
		field: 'sectorName',
		headerName: 'Sector',
		width: 140,
		align: 'center',
		headerAlign: 'center',
		renderCell: (params: GridCellParams) => (
			<Chip
				label={params.value as string}
				color="primary"
				variant="outlined"
				size="small"
				sx={{
					paddingTop: '0.25rem',
					fontSize: '0.75rem',
				}}
			/>
		),
	},
	{
		field: 'currentPrice',
		headerName: 'Price',
		width: 100,
		align: 'center',
		headerAlign: 'center',
		renderCell: (params: GridCellParams) => (
			<Typography variant="body2" fontWeight="medium">
				{formatPrice(params.value as number)}
			</Typography>
		),
	},
	{
		field: 'priceChange',
		headerName: 'Change',
		width: 100,
		align: 'center',
		headerAlign: 'center',
		renderCell: (params: GridCellParams) => {
			const change = params.value as number | undefined;
			return (
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						gap: 0.5,
					}}
				>
					{getChangeIcon(change)}
					<Typography
						variant="body2"
						color={getChangeColor(change)}
						fontWeight="medium"
					>
						{change !== undefined
							? `${change >= 0 ? '+' : ''}${change.toFixed(2)}`
							: 'N/A'}
					</Typography>
				</Box>
			);
		},
	},
	{
		field: 'priceChangePercent',
		headerName: 'Change %',
		width: 100,
		align: 'center',
		headerAlign: 'center',
		renderCell: (params: GridCellParams) => {
			const changePercent = params.value as number | undefined;
			return (
				<Typography
					variant="body2"
					color={getChangeColor(changePercent)}
					fontWeight="medium"
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						gap: 0.5,
					}}
				>
					{changePercent !== undefined
						? `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`
						: 'N/A'}
				</Typography>
			);
		},
	},
	{
		field: 'chart',
		headerName: '7-Day Chart',
		width: 200,
		align: 'center',
		headerAlign: 'center',
		sortable: false,
		filterable: false,
		renderCell: (params: GridCellParams) => <Chart7Day params={params} />,
	},
];

function Chart7Day({ params }: { params: GridCellParams }) {
	const stock = params.row as StockWithMarketData;
	if (
		!stock.marketData?.historical ||
		stock.marketData.historical.length === 0
	) {
		return (
			<Typography variant="caption" color="text.secondary">
				{'No data'}
			</Typography>
		);
	}

	const historicalData = stock.marketData.historical;
	const firstPrice = historicalData[0]?.close;
	const lastPrice = historicalData[historicalData.length - 1]?.close;
	const highPrice = Math.max(...historicalData.map((h) => h.close));
	const lowPrice = Math.min(...historicalData.map((h) => h.close));

	return (
		<div className="flex flex-col items-center justify-center">
			<div className="flex flex-col items-center justify-center gap-0 w-full h-5">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={stock.marketData.historical}>
						<XAxis dataKey="date" hide />
						<YAxis
							hide
							domain={(() => {
								// 데이터의 최저가와 최고가 계산
								const prices = stock.marketData!.historical!.map(
									(h) => h.close,
								);
								const minPrice = Math.min(...prices);
								const maxPrice = Math.max(...prices);

								// 5% 패딩을 추가하여 더 타이트한 범위 설정
								const padding = (maxPrice - minPrice) * 0.05;
								return [
									Math.max(0, minPrice - padding), // 0보다 작아지지 않도록
									maxPrice + padding,
								];
							})()}
						/>
						<Tooltip
							content={({ label, payload }) => {
								return (
									<div className="flex flex-col items-center justify-center border border-gray-300 rounded-md p-4 m-2 z-10 fixed bg-white">
										<Typography variant="body2">{label}</Typography>
										<Typography
											variant="body2"
											fontWeight="bold"
											sx={{ color: payload?.[0]?.stroke ?? 'black' }}
										>{`$${payload?.[0]?.value.toFixed(2)}`}</Typography>
									</div>
								);
							}}
							wrapperStyle={{
								display: 'inline-block',
							}}
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
			</div>
			<div className="flex flex-col items-center justify-center gap-0 w-full h-10">
				<p className="text-xs">
					first: ${firstPrice?.toFixed(2)} / last: ${lastPrice?.toFixed(2)}
				</p>
				<p className="text-xs">
					min: ${lowPrice.toFixed(2)} / max: ${highPrice.toFixed(2)}
				</p>
			</div>
		</div>
	);
}

export default function MarketTableView({
	stocksWithMarketData,
	loading,
	marketDataLoading,
	onStockClick,
}: MarketTableViewProps) {
	// Custom render function for 7-day chart

	// Convert stock data to DataGrid rows format
	const rows: GridRowsProp = stocksWithMarketData.map((stock) => ({
		...stock,
		id: stock.id,
		ticker: stock.ticker,
		companyName: stock.companyName,
		sectorName: stock.sector.name,
		currentPrice: stock.marketData?.currentPrice,
		priceChange: stock.marketData?.priceChange,
		priceChangePercent: stock.marketData?.priceChangePercent,
		chart: null, // This will be handled by render7DayChart
	}));

	return (
		<Paper elevation={2} sx={{ height: '100%', width: '100%' }}>
			<DataGrid
				rows={rows}
				columns={columns}
				rowHeight={100}
				initialState={{
					pagination: {
						paginationModel: { page: 0, pageSize: 50 },
					},
				}}
				pageSizeOptions={[50, 100, 200]}
				disableRowSelectionOnClick
				density="comfortable"
				disableColumnResize
				disableColumnMenu
				onRowClick={(params) => onStockClick(params.row.ticker)}
				loading={loading || marketDataLoading}
				localeText={{
					noRowsLabel: 'No stocks found. Add stocks to see market data!',
				}}
				sx={{
					'--DataGrid-rowBorderColor': gray[200],
					'& .MuiDataGrid-cell': {
						display: 'flex',
						alignItems: 'center',
					},
				}}
			/>
		</Paper>
	);
}
