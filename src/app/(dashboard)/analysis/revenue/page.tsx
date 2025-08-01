'use client';

import {
	Download as DownloadIcon,
	Search as SearchIcon,
} from '@mui/icons-material';
import {
	Alert,
	Box,
	Button,
	Card,
	CardContent,
	Container,
	InputAdornment,
	Paper,
	TextField,
	Typography,
} from '@mui/material';
import {
	DataGrid,
	type GridRowParams,
	type GridRowSelectionModel,
} from '@mui/x-data-grid';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useGridSelection } from '@/utils/grid-selection';
import { generateColumns } from './column';
import { exportRevenueAnalysis } from './excel-export';
import { processAnalysesData } from './revenue-analysis-calculation';
import type {
	PaginationInfo,
	RevenueAnalysis,
	RevenueAnalysisApiResponse,
} from './types';

export default function RevenueAnalysisPage() {
	const [rawAnalyses, setRawAnalyses] = useState<RevenueAnalysis[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchPeriod, setSearchPeriod] = useState<string>('');
	const [message, setMessage] = useState<{
		type: 'success' | 'error';
		text: string;
	} | null>(null);

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

	// Memoize processed analyses
	const analyses = useMemo(() => {
		console.log('Processing analyses data...');
		return processAnalysesData(rawAnalyses);
	}, [rawAnalyses]);

	// Extract all row IDs for grid selection
	const allRowIds = useMemo(() => {
		return analyses.map((analysis) => analysis.id);
	}, [analyses]);

	// Use the custom grid selection hook
	const {
		rowSelectionModel,
		selectedRowIds,
		selectedRowCount,
		handleSelectionChange,
		clearSelection,
		isEmpty: isSelectionEmpty,
	} = useGridSelection(allRowIds);

	// Memoize columns generation
	const columns = useMemo(() => generateColumns(), []);

	const handleRowClick = useCallback((params: GridRowParams) => {
		console.log('Row clicked:', params.row);
	}, []);

	// Excel download function - now using excel-export utility
	const downloadExcel = useCallback(() => {
		console.log('Starting download with selected IDs:', selectedRowIds);

		if (selectedRowIds.length === 0) {
			setMessage({
				type: 'error',
				text: 'Please select at least one row to download',
			});
			return;
		}

		try {
			// Filter selected analyses
			const selectedAnalyses = analyses.filter((analysis) =>
				selectedRowIds.includes(analysis.id),
			);

			if (selectedAnalyses.length === 0) {
				setMessage({
					type: 'error',
					text: 'No valid data found for selected rows',
				});
				return;
			}

			// Use the excel export utility
			const result = exportRevenueAnalysis(selectedAnalyses);

			// Handle result
			if (result.success) {
				setMessage({
					type: 'success',
					text: result.message,
				});
			} else {
				setMessage({
					type: 'error',
					text: result.message,
				});
			}
		} catch (error) {
			console.error('Excel download error:', error);
			setMessage({
				type: 'error',
				text: 'Failed to download Excel file. Please try again.',
			});
		}
	}, [analyses, selectedRowIds]);

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
				const data: RevenueAnalysisApiResponse = await response.json();
				setRawAnalyses(data.data);
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

	useEffect(() => {
		fetchAnalyses(1);
	}, [fetchAnalyses]);

	return (
		<Container maxWidth={100 as any}>
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
							<button type="submit" style={{ display: 'none' }} />{' '}
							<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
								Press Enter to search or leave empty to view all records
							</Typography>
						</Box>

						{/* Download Section */}
						<Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
							<Button
								variant="contained"
								startIcon={<DownloadIcon />}
								onClick={downloadExcel}
								disabled={selectedRowCount === 0}
								color="primary"
							>
								Download Excel ({selectedRowCount})
							</Button>
							<Button
								variant="outlined"
								onClick={clearSelection}
								disabled={isSelectionEmpty}
								size="small"
							>
								Clear Selection
							</Button>
							<Typography variant="body2" color="text.secondary">
								Select rows in the table below to enable download
							</Typography>
						</Box>
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
					getRowId={(row) => row.id}
					onRowClick={handleRowClick}
					paginationModel={paginationModel}
					onPaginationModelChange={handlePaginationModelChange}
					paginationMode="server"
					rowCount={pagination.totalItems}
					pageSizeOptions={[50]}
					initialState={{
						pagination: { paginationModel: { pageSize: 50 } },
					}}
					checkboxSelection
					rowSelectionModel={rowSelectionModel}
					onRowSelectionModelChange={(newSelection: GridRowSelectionModel) => {
						handleSelectionChange(newSelection);
					}}
					density="compact"
					disableVirtualization={true}
					sx={{
						// Sticky Checkbox column (leftmost at 0px)
						'& .MuiDataGrid-columnHeader[data-field="__check__"], & .MuiDataGrid-cell[data-field="__check__"]':
							{
								position: 'sticky !important',
								left: '0px !important',
								backgroundColor: 'background.default',
								zIndex: '1100 !important',
								borderRight: '1px solid',
								borderRightColor: 'divider',
							},
						// Sticky Ticker column (second at ~52px after checkbox)
						'& .MuiDataGrid-columnHeader[data-field="stock.ticker"], & .MuiDataGrid-cell[data-field="stock.ticker"]':
							{
								position: 'sticky !important',
								left: '50px !important',
								backgroundColor: 'background.default',
								zIndex: '1100 !important',
								borderRight: '1px solid',
								borderRightColor: 'divider',
								boxShadow: '1px 0 4px rgba(0,0,0,0.05)',
							},
						// Sticky Company Name column (third at ~152px after checkbox + ticker)
						'& .MuiDataGrid-columnHeader[data-field="stock.companyName"], & .MuiDataGrid-cell[data-field="stock.companyName"]':
							{
								position: 'sticky !important',
								left: '150px !important',
								backgroundColor: 'background.default',
								zIndex: '1100 !important',
								borderRight: '1px solid',
								borderRightColor: 'divider',
								boxShadow: '1px 0 4px rgba(0,0,0,0.05)',
							},
						'& .MuiDataGrid-columnHeader[data-field="sales_growth_avg"], & .MuiDataGrid-cell[data-field="sales_growth_avg"]':
							{
								borderLeft: '1px solid',
								borderLeftColor: 'divider',
							},
						// Ensure the viewport allows sticky positioning
						'& .MuiDataGrid-virtualScroller': {
							overflow: 'auto !important',
						},
						'& .MuiDataGrid-virtualScrollerRenderZone': {
							position: 'relative',
						},
					}}
				/>
			</Paper>
		</Container>
	);
}
