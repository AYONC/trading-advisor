import { Typography, Chip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

export const getGradeColor = (grade: string): string => {
	if (grade.startsWith('A')) return '#4caf50'; // Green
	if (grade.startsWith('B')) return '#ff9800'; // Orange
	if (grade.startsWith('C')) return '#2196f3'; // Blue
	if (grade.startsWith('D')) return '#ff5722'; // Deep Orange
	return '#9e9e9e'; // Grey for E
};

// Function to generate columns (now simplified since data is pre-processed)
export const generateColumns = (): GridColDef[] => {
	const baseColumns: GridColDef[] = [
		{
			field: 'stock.ticker',
			headerName: 'Ticker',
			width: 100,
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
			renderCell: (params) => (
				<p className={'text-sm font-medium'}>{params.row.stock.companyName}</p>
			),
		},
		{
			field: 'period',
			headerName: 'Period',
			width: 100,
			align: 'center',
			headerAlign: 'center',
			type: 'number',
		},
		{
			field: 'stock.id',
			headerName: 'Stock ID',
			width: 100,
			align: 'center',
			headerAlign: 'center',
			valueGetter: (_, row) => row.stock.id,
			renderCell: (params) => params.row.stock.id,
		},
		{
			field: 'epsRevisionGrade',
			headerName: 'EPS Revision Grade',
			width: 140,
			align: 'center',
			headerAlign: 'center',
			renderCell: (params) => (
				<Chip
					label={params.value}
					size="medium"
					sx={{
						backgroundColor: getGradeColor(params.value),
						border: 'none',
						color: 'white',
						fontWeight: 'bold',
						minWidth: 40,
						'& .MuiChip-label': {
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							color: 'white',
							fontWeight: 'bold',
							lineHeight: '1',
							fontSize: '14px',
						},
					}}
				/>
			),
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
			field: 'pe',
			headerName: 'P/E (FWD)',
			width: 100,
			align: 'center',
			headerAlign: 'center',
			type: 'number',
			renderCell: (params) => Number(params.value).toFixed(2),
		},
		{
			field: 'roa',
			headerName: 'ROA',
			width: 100,
			align: 'center',
			headerAlign: 'center',
			type: 'number',
			renderCell: (params) => `${(Number(params.value) * 100).toFixed(2)}%`,
		},
		{
			field: 'epsGrowthAdjustedRate',
			headerName: 'EPS Growth Adj. Rate',
			width: 140,
			align: 'center',
			headerAlign: 'center',
			type: 'number',
			renderCell: (params) =>
				params.value ? `${(Number(params.value) * 100).toFixed(2)}%` : '-',
		},
	];

	// Add EPS growth columns (now using pre-calculated values)
	const epsGrowthColumns: GridColDef[] = [
		{
			field: 'eps_growth_0',
			headerName: 'EPS Growth +0',
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
			field: 'eps_growth_1',
			headerName: 'EPS Growth +1',
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
			field: 'eps_growth_2',
			headerName: 'EPS Growth +2',
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
	const epsGrowthAvgColumn: GridColDef = {
		field: 'eps_growth_avg',
		headerName: 'EPS Growth Avg',
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
	const epsRatioColumn: GridColDef = {
		field: 'eps_ratio',
		headerName: 'EPS Ratio',
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

	// Add 성장성 Valuation (PER) column
	const growthValuationColumn: GridColDef = {
		field: 'growth_valuation',
		headerName: '성장성 Valuation (PER)',
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

	// Add 성장수익성 Valuation (PER) column
	const growthProfitabilityValuationColumn: GridColDef = {
		field: 'growth_profitability_valuation',
		headerName: '성장수익성 Valuation (PER)',
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
		...baseColumns,
		...epsGrowthColumns,
		epsGrowthAvgColumn,
		epsRatioColumn,
		growthValuationColumn,
		growthValuationPriceColumn,
		growthProfitabilityValuationColumn,
		growthProfitabilityValuationPriceColumn,
		upsidePotentialColumn,
		...endColumns,
	];
};
