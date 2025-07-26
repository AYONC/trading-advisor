'use client';

import {
	Business as BusinessIcon,
	TrendingUp as StockIcon,
	Tag as TagIcon,
} from '@mui/icons-material';
import { Alert, Box, Chip, Container, Paper, Typography } from '@mui/material';
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
		description: string;
	};
	createdAt: string;
	updatedAt: string;
}

const columns: GridColDef[] = [
	{
		field: 'id',
		headerName: 'ID',
		width: 80,
		renderHeader: () => (
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
				<TagIcon fontSize="small" />
				ID
			</Box>
		),
		renderCell: (params) => (
			<Typography
				variant="body2"
				sx={{
					fontFamily: 'monospace',
					color: 'text.secondary',
					fontWeight: 'medium',
				}}
			>
				#{params.value}
			</Typography>
		),
	},
	{
		field: 'ticker',
		headerName: 'Ticker',
		width: 120,
		renderHeader: () => (
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
				<StockIcon fontSize="small" />
				Ticker
			</Box>
		),
		renderCell: (params) => (
			<Chip
				label={params.value}
				variant="outlined"
				color="primary"
				sx={{
					fontFamily: 'monospace',
					fontWeight: 'bold',
				}}
			/>
		),
	},
	{
		field: 'companyName',
		headerName: 'Company Name',
		flex: 1,
		minWidth: 200,
		renderCell: (params) => (
			<Typography variant="body2" fontWeight="medium">
				{params.value}
			</Typography>
		),
	},
	{
		field: 'sectorName',
		headerName: 'Sector',
		width: 150,
		renderHeader: () => (
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
				<BusinessIcon fontSize="small" />
				Sector
			</Box>
		),
		renderCell: (params) => (
			<Chip
				label={params.value}
				variant="filled"
				color="secondary"
				size="small"
				sx={{
					fontFamily: 'monospace',
					fontWeight: 'bold',
				}}
			/>
		),
	},
	{
		field: 'createdAt',
		headerName: 'Created',
		width: 200,
		align: 'center',
		headerAlign: 'center',
		renderCell: (params) => formatDateTime(params.value),
	},
	{
		field: 'updatedAt',
		headerName: 'Updated',
		width: 200,
		align: 'center',
		headerAlign: 'center',
		renderCell: (params) => formatDateTime(params.value),
	},
];

export default function StocksPage() {
	const [stocks, setStocks] = useState<Stock[]>([]);
	const [loading, setLoading] = useState(true);
	const [message, setMessage] = useState<{
		type: 'success' | 'error';
		text: string;
	} | null>(null);

	const fetchStocks = useCallback(async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/stocks');
			if (response.ok) {
				const data = await response.json();
				setStocks(data);
			} else {
				setMessage({ type: 'error', text: 'Failed to load stocks' });
			}
		} catch (error) {
			setMessage({ type: 'error', text: 'Error loading stocks' });
		} finally {
			setLoading(false);
		}
	}, []);

	const handleRowClick = (params: GridRowParams) => {
		const ticker = params.row.ticker;
		window.open(`https://finance.yahoo.com/quote/${ticker}`, '_blank');
	};

	// Transform stocks data for DataGrid
	const rows = stocks.map((stock) => ({
		...stock,
		sectorName: stock.sector.name,
	}));

	useEffect(() => {
		fetchStocks();
	}, [fetchStocks]);

	return (
		<Container maxWidth="xl">
			<Box sx={{ py: 4 }}>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						mb: 4,
					}}
				>
					<Box>
						<Typography variant="h4" component="h1" gutterBottom>
							Stock List
						</Typography>
						<Typography variant="subtitle1" color="text.secondary">
							View all stocks with their sector information. Click on any row to
							view on Yahoo Finance.
						</Typography>
					</Box>
				</Box>

				{message && (
					<Alert severity={message.type} sx={{ mb: 3 }}>
						{message.text}
					</Alert>
				)}

				<Paper elevation={2}>
					<Box sx={{ height: '100%', width: '100%' }}>
						<DataGrid
							rows={rows}
							columns={columns}
							loading={loading}
							onRowClick={handleRowClick}
							initialState={{
								pagination: { paginationModel: { pageSize: 50 } },
							}}
							pageSizeOptions={[10, 25, 50, 100]}
							density="standard"
							disableRowSelectionOnClick
							sx={{
								'& .MuiDataGrid-row': {
									cursor: 'pointer',
									'&:hover': {
										backgroundColor: 'action.hover',
									},
								},
								'& .MuiDataGrid-cell:focus': {
									outline: 'none',
								},
								'& .MuiDataGrid-row:focus': {
									outline: 'none',
								},
							}}
							slots={{
								noRowsOverlay: () => (
									<Box
										sx={{
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											height: '100%',
										}}
									>
										<Typography color="text.secondary">
											No stocks found. Add stocks using the "Add Stock" page!
										</Typography>
									</Box>
								),
							}}
						/>
					</Box>
				</Paper>
			</Box>
		</Container>
	);
}
