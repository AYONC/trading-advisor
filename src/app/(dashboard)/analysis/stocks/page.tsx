'use client';

import {
	Business as BusinessIcon,
	TrendingUp as StockIcon,
	Tag as TagIcon,
} from '@mui/icons-material';
import {
	Alert,
	Box,
	Chip,
	CircularProgress,
	Container,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
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

	const handleStockClick = (ticker: string) => {
		window.open(`https://finance.yahoo.com/quote/${ticker}`, '_blank');
	};

	useEffect(() => {
		fetchStocks();
	}, [fetchStocks]);

	return (
		<Container maxWidth="lg">
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
					{loading ? (
						<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
							<CircularProgress />
						</Box>
					) : (
						<TableContainer>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>
											<Box
												sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
											>
												<TagIcon fontSize="small" />
												ID
											</Box>
										</TableCell>
										<TableCell>
											<Box
												sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
											>
												<StockIcon fontSize="small" />
												Ticker
											</Box>
										</TableCell>
										<TableCell>Company Name</TableCell>
										<TableCell>
											<Box
												sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
											>
												<BusinessIcon fontSize="small" />
												Sector
											</Box>
										</TableCell>
										<TableCell>Created</TableCell>
										<TableCell>Updated</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{stocks.length === 0 ? (
										<TableRow>
											<TableCell colSpan={6} align="center" sx={{ py: 4 }}>
												<Typography color="text.secondary">
													No stocks found. Add stocks using the "Add Stock"
													page!
												</Typography>
											</TableCell>
										</TableRow>
									) : (
										stocks.map((stock) => (
											<TableRow
												key={stock.id}
												hover
												onClick={() => handleStockClick(stock.ticker)}
												sx={{
													cursor: 'pointer',
													'&:hover': {
														backgroundColor: 'action.hover',
													},
												}}
											>
												<TableCell>
													<Typography
														variant="body2"
														sx={{
															fontFamily: 'monospace',
															color: 'text.secondary',
															fontWeight: 'medium',
														}}
													>
														#{stock.id}
													</Typography>
												</TableCell>
												<TableCell>
													<Chip
														label={stock.ticker}
														variant="outlined"
														color="primary"
														sx={{
															fontFamily: 'monospace',
															fontWeight: 'bold',
														}}
													/>
												</TableCell>
												<TableCell>
													<Typography variant="body2" fontWeight="medium">
														{stock.companyName}
													</Typography>
												</TableCell>
												<TableCell>
													<Chip
														label={stock.sector.name}
														variant="filled"
														color="secondary"
														size="small"
													/>
												</TableCell>
												<TableCell>{formatDateTime(stock.createdAt)}</TableCell>
												<TableCell>{formatDateTime(stock.updatedAt)}</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</TableContainer>
					)}
				</Paper>
			</Box>
		</Container>
	);
}
