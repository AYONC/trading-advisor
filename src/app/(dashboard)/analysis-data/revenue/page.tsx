'use client';

import { Search as SearchIcon } from '@mui/icons-material';
import {
	Alert,
	Box,
	Card,
	CardContent,
	Chip,
	Container,
	InputAdornment,
	Paper,
	TextField,
	Typography,
} from '@mui/material';
import {
	DataGrid,
	type GridColDef,
	type GridRowParams,
} from '@mui/x-data-grid';
import { useCallback, useEffect, useState } from 'react';
import { formatDateTime } from '@/utils/date';

interface Stock {
	id: number;
	ticker: string;
	companyName: string;
	sector: {
		id: number;
		name: string;
	};
}

interface RevenueAnalysis {
	id: number;
	period: number;
	price: number;
	ps: number;
	operatingMargin: number;
	salesGrowthAdjustedRate?: number;
	createdAt: string;
	updatedAt: string;
	stock: Stock;
}

interface PaginationInfo {
	current: number;
	total: number;
	limit: number;
	totalItems: number;
	hasNext: boolean;
	hasPrev: boolean;
}

interface ApiResponse {
	data: RevenueAnalysis[];
	pagination: PaginationInfo;
}

const columns: GridColDef[] = [
	{
		field: 'period',
		headerName: 'Period',
		align: 'center',
		headerAlign: 'center',
		type: 'number',
	},
	{
		field: 'stock.id',
		headerName: 'Stock ID',
		align: 'center',
		headerAlign: 'center',
		valueGetter: (_, row) => row.stock.id,
		renderCell: (params) => params.row.stock.id,
	},
	{
		field: 'stock.ticker',
		headerName: 'Ticker',
		valueGetter: (_, row) => row.stock.ticker,
		renderCell: (params) => {
			return (
				<Typography variant="body2" fontWeight="bold">
					{params.row.stock.ticker}
				</Typography>
			);
		},
	},
	{
		field: 'stock.companyName',
		headerName: 'Company Name',
		flex: 1,
		minWidth: 500,
		align: 'left',
		headerAlign: 'left',
		valueGetter: (_, row) => row.stock.companyName,
		renderCell: (params) => params.row.stock.companyName,
	},
	{
		field: 'stock.sector.name',
		headerName: 'Sector',
		width: 120,
		align: 'left',
		headerAlign: 'left',
		valueGetter: (_, row) => row.stock.sector.name,
		renderCell: (params) => {
			return (
				<Chip
					label={params.row.stock.sector.name}
					variant="outlined"
					color="primary"
					size="small"
					sx={{
						fontFamily: 'monospace',
						fontWeight: 'bold',
					}}
				/>
			);
		},
	},
	{
		field: 'price',
		headerName: 'Price',
		width: 100,
		align: 'center',
		headerAlign: 'center',
		type: 'number',
		renderCell: (params) => (
			<Typography variant="body2" fontWeight="medium">
				${Number(params.value).toFixed(2)}
			</Typography>
		),
	},
	{
		field: 'ps',
		headerName: 'P/S (FWD)',
		width: 100,
		align: 'center',
		headerAlign: 'center',
		type: 'number',
		renderCell: (params) => Number(params.value).toFixed(2),
	},
	{
		field: 'operatingMargin',
		headerName: 'Operating Margin',
		width: 100,
		align: 'center',
		headerAlign: 'center',
		type: 'number',
		renderCell: (params) => `${(Number(params.value) * 100).toFixed(2)}%`,
	},
	{
		field: 'salesGrowthAdjustedRate',
		headerName: 'Sales Growth Adj. Rate',
		width: 140,
		align: 'center',
		headerAlign: 'center',
		type: 'number',
		renderCell: (params) =>
			params.value ? `${(Number(params.value) * 100).toFixed(2)}%` : '-',
	},
	{
		field: 'createdAt',
		headerName: 'Created',
		width: 200,
		align: 'center',
		headerAlign: 'center',
		renderCell: (params) => formatDateTime(params.row.createdAt),
	},
];

export default function RevenueAnalysisPage() {
	const [analyses, setAnalyses] = useState<RevenueAnalysis[]>([]);
	console.log(analyses);
	const [loading, setLoading] = useState(true);
	const [pagination, setPagination] = useState<PaginationInfo>({
		current: 1,
		total: 1,
		limit: 50,
		totalItems: 0,
		hasNext: false,
		hasPrev: false,
	});
	const [paginationModel, setPaginationModel] = useState({
		page: 0,
		pageSize: 50,
	});
	const [searchPeriod, setSearchPeriod] = useState('');
	const [message, setMessage] = useState<{
		type: 'success' | 'error';
		text: string;
	} | null>(null);

	const fetchAnalyses = useCallback(async (page = 1, period?: string) => {
		try {
			setLoading(true);
			setMessage(null);

			const params = new URLSearchParams({
				page: page.toString(),
				limit: '50',
			});

			if (period && period.trim()) {
				params.append('period', period.trim());
			}

			const response = await fetch(`/api/revenue-analysis?${params}`);

			if (response.ok) {
				const data: ApiResponse = await response.json();
				setAnalyses(data.data);
				setPagination(data.pagination);
				setPaginationModel({
					page: data.pagination.current - 1, // DataGrid uses 0-based page
					pageSize: data.pagination.limit,
				});
			} else {
				setMessage({ type: 'error', text: 'Failed to load revenue analyses' });
			}
		} catch (error) {
			console.error('Error fetching analyses:', error);
			setMessage({ type: 'error', text: 'Error loading revenue analyses' });
		} finally {
			setLoading(false);
		}
	}, []);

	const handlePaginationModelChange = (
		newPaginationModel: typeof paginationModel,
	) => {
		const newPage = newPaginationModel.page + 1; // Convert to 1-based page
		if (newPage !== pagination.current) {
			fetchAnalyses(newPage, searchPeriod);
		}
		setPaginationModel(newPaginationModel);
	};

	const handleSearchSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		setPaginationModel({ page: 0, pageSize: 50 }); // Reset to first page
		fetchAnalyses(1, searchPeriod);
	};

	const handleRowClick = (params: GridRowParams) => {
		const ticker = params.row.stock?.ticker;
		if (ticker) {
			window.open(`https://finance.yahoo.com/quote/${ticker}`, '_blank');
		}
	};

	useEffect(() => {
		fetchAnalyses(1);
	}, [fetchAnalyses]);

	return (
		<Container maxWidth="xl">
			<Box sx={{ py: 4 }}>
				<Box sx={{ mb: 4 }}>
					<Typography variant="h4" component="h1" gutterBottom>
						Revenue Stock Analysis
					</Typography>
					<Typography variant="subtitle1" color="text.secondary">
						View revenue analysis data with financial metrics. Click on any row
						to view stock on Yahoo Finance.
					</Typography>
				</Box>

				{/* Search Section */}
				<Card elevation={2} sx={{ mb: 3 }}>
					<CardContent>
						<Typography variant="h6" gutterBottom>
							Search & Filter
						</Typography>
						<Box
							component="form"
							onSubmit={handleSearchSubmit}
							sx={{ display: 'flex', gap: 2, alignItems: 'center' }}
						>
							<TextField
								label="Period"
								placeholder="Enter period number..."
								value={searchPeriod}
								onChange={(e) => setSearchPeriod(e.target.value)}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<SearchIcon />
										</InputAdornment>
									),
								}}
								size="small"
								sx={{ minWidth: 300 }}
							/>
							<button type="submit" style={{ display: 'none' }} />
						</Box>
						<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
							Press Enter to search or leave empty to view all records
						</Typography>
					</CardContent>
				</Card>

				{message && (
					<Alert severity={message.type} sx={{ mb: 3 }}>
						{message.text}
					</Alert>
				)}

				{/* Results Summary */}
				{!loading && (
					<Box sx={{ mb: 2 }}>
						<Typography variant="body2" color="text.secondary">
							Showing {analyses.length} of {pagination.totalItems} revenue
							analyses
							{searchPeriod && ` (filtered by period: ${searchPeriod})`}
						</Typography>
					</Box>
				)}
			</Box>
			{/* Data Grid */}
			<Paper
				elevation={2}
				sx={{ height: '100%', width: '100%', overflow: 'auto' }}
			>
				<DataGrid
					rows={analyses}
					columns={columns}
					loading={loading}
					rowHeight={80}
					onRowClick={handleRowClick}
					paginationModel={paginationModel}
					onPaginationModelChange={handlePaginationModelChange}
					paginationMode="server"
					rowCount={pagination.totalItems}
					pageSizeOptions={[50]}
					initialState={{
						pagination: { paginationModel: { pageSize: 50 } },
					}}
					disableRowSelectionOnClick
					density="compact"
				/>
			</Paper>
		</Container>
	);
}
