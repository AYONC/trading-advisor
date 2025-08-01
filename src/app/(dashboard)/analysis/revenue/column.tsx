import { Chip, Typography } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';

export const generateColumns = (): GridColDef[] => {
	const columns: GridColDef[] = [
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
			minWidth: 300,
			align: 'left',
			headerAlign: 'left',
			valueGetter: (_, row) => row.stock.companyName,
			renderCell: (params) => params.row.stock.companyName,
		},
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
	];

	const salesGrowthColumns: GridColDef[] = [
		{
			field: 'sales_growth_0',
			headerName: 'Sales Growth +0',
			width: 120,
			align: 'center',
			headerAlign: 'center',
			type: 'number',
			renderCell: (params) => {
				if (params.value !== null && params.value !== undefined) {
					return `${(Number(params.value) * 100).toFixed(2)}%`;
				}
				return '-';
			},
		},
		{
			field: 'sales_growth_1',
			headerName: 'Sales Growth +1',
			width: 120,
			align: 'center',
			headerAlign: 'center',
			type: 'number',
			renderCell: (params) => {
				if (params.value !== null && params.value !== undefined) {
					return `${(Number(params.value) * 100).toFixed(2)}%`;
				}
				return '-';
			},
		},
		{
			field: 'sales_growth_2',
			headerName: 'Sales Growth +2',
			width: 120,
			align: 'center',
			headerAlign: 'center',
			type: 'number',
			renderCell: (params) => {
				if (params.value !== null && params.value !== undefined) {
					return `${(Number(params.value) * 100).toFixed(2)}%`;
				}
				return '-';
			},
		},
	];

	// Add EPS growth average column (now using pre-calculated value)
	const salesGrowthAvgColumn: GridColDef = {
		field: 'sales_growth_avg',
		headerName: 'Sales Growth Avg',
		width: 130,
		align: 'center',
		headerAlign: 'center',
		type: 'number',
		renderCell: (params) => {
			if (params.value !== null && params.value !== undefined) {
				return `${(Number(params.value) * 100).toFixed(2)}%`;
			}
			return '-';
		},
	};

	// Add EPS ratio column (now using pre-calculated value)
	const psgRatioColumn: GridColDef = {
		field: 'psg_ratio',
		headerName: 'PSG Ratio',
		width: 120,
		align: 'center',
		headerAlign: 'center',
		type: 'number',
		renderCell: (params) => {
			if (params.value !== null && params.value !== undefined) {
				return Number(params.value).toFixed(2);
			}
			return '-';
		},
	};

	// Add 성장성 Valuation (PSR) column
	const growthValuationColumn: GridColDef = {
		field: 'growth_valuation',
		headerName: '성장성 Valuation (PSR)',
		width: 180,
		align: 'center',
		headerAlign: 'center',
		type: 'number',
		renderCell: (params) => {
			if (params.value !== null && params.value !== undefined) {
				return `${Number(params.value).toFixed(2)}`;
			}
			return '-';
		},
	};

	// Add 성장성 Valuation Price column
	const growthValuationPriceColumn: GridColDef = {
		field: 'growth_valuation_price',
		headerName: '성장성 Valuation Price',
		width: 180,
		align: 'center',
		headerAlign: 'center',
		type: 'number',
		renderCell: (params) => {
			if (params.value !== null && params.value !== undefined) {
				return `$${Number(params.value).toFixed(2)}`;
			}
			return '-';
		},
	};

	// Add 성장수익성 Valuation (PSR) column
	const growthProfitabilityValuationColumn: GridColDef = {
		field: 'growth_profitability_valuation',
		headerName: '성장수익성 Valuation (PSR)',
		width: 200,
		align: 'center',
		headerAlign: 'center',
		type: 'number',
		renderCell: (params) => {
			if (params.value !== null && params.value !== undefined) {
				return `${Number(params.value).toFixed(2)}`;
			}
			return '-';
		},
	};

	// Add 성장수익성 Valuation Price column
	const growthProfitabilityValuationPriceColumn: GridColDef = {
		field: 'growth_profitability_valuation_price',
		headerName: '성장수익성 Valuation Price',
		width: 200,
		align: 'center',
		headerAlign: 'center',
		type: 'number',
		renderCell: (params) => {
			if (params.value !== null && params.value !== undefined) {
				return `$${Number(params.value).toFixed(2)}`;
			}
			return '-';
		},
	};

	// Add Upside Potential column with color coding
	const upsidePotentialColumn: GridColDef = {
		field: 'upside_potential',
		headerName: 'Upside Potential',
		width: 150,
		align: 'center',
		headerAlign: 'center',
		type: 'number',
		renderCell: (params) => {
			if (params.value !== null && params.value !== undefined) {
				const value = Number(params.value);
				const percentage = (value * 100).toFixed(2);

				// Calculate color based on value - 0 = black, negative = red, positive = green
				const absValue = Math.abs(value);
				const intensity = Math.min(absValue / 0.4, 1); // Cap at 1 for max intensity

				const backgroundColor: string = 'initial';
				let color: string = 'var(--mui-palette-text-primary)';

				if (value < -0.05) {
					// Interpolate from black (0,0,0) to red (255,0,0)
					const red = Math.round(Math.max(intensity * 255, 200));
					color = `rgb(${red}, 0, 0)`;
				} else if (value > 0.05) {
					// Interpolate from black (0,0,0) to green (0,255,0)
					const green = Math.round(Math.max(intensity * 190, 130));
					color = `rgb(0, ${green}, 20)`;
				} else {
					// Exactly zero - black
					color = 'var(--mui-palette-text-primary)';
				}

				return (
					<div
						style={{
							backgroundColor,
							color,
							padding: '4px 8px',
							borderRadius: '4px',
							fontWeight: 'bold',
							width: '100%',
							fontSize: '14px',
							textAlign: 'center',
							WebkitTextStroke: `0.3px ${color}`,
						}}
					>
						{percentage}%
					</div>
				);
			}
			return '-';
		},
	};

	const endColumns: GridColDef[] = [
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
			field: 'createdAt',
			headerName: 'Created',
			width: 200,
			align: 'center',
			headerAlign: 'center',
			renderCell: (params) => params.row.createdAt,
		},
	];

	return [
		...columns,
		...salesGrowthColumns,
		salesGrowthAvgColumn,
		psgRatioColumn,
		growthValuationColumn,
		growthValuationPriceColumn,
		growthProfitabilityValuationColumn,
		growthProfitabilityValuationPriceColumn,
		upsidePotentialColumn,
		...endColumns,
	];
};
