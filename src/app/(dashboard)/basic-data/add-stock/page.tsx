'use client';

import { Add as AddIcon } from '@mui/icons-material';
import {
	Alert,
	Autocomplete,
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	CircularProgress,
	Container,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

interface Sector {
	id: number;
	name: string;
	description: string;
}

interface FormData {
	ticker: string;
	companyName: string;
	sectorId: number | '';
}

interface StockQuote {
	symbol: string;
	shortName: string;
	longName: string;
	regularMarketPrice: number;
	currency: string;
}

// Common stock tickers for autocomplete
const POPULAR_TICKERS = [
	'AAPL',
	'GOOGL',
	'MSFT',
	'AMZN',
	'TSLA',
	'META',
	'NVDA',
	'NFLX',
	'BABA',
	'V',
	'JPM',
	'JNJ',
	'WMT',
	'PG',
	'UNH',
	'DIS',
	'ADBE',
	'PYPL',
	'INTC',
	'CMCSA',
	'VZ',
	'NFLX',
	'KO',
	'PFE',
	'T',
];

export default function AddStockPage() {
	const [formData, setFormData] = useState<FormData>({
		ticker: '',
		companyName: '',
		sectorId: '',
	});
	const [sectors, setSectors] = useState<Sector[]>([]);
	const [loading, setLoading] = useState(false);
	const [loadingSectors, setLoadingSectors] = useState(true);
	const [loadingQuote, setLoadingQuote] = useState(false);
	const [stockQuote, setStockQuote] = useState<StockQuote | null>(null);
	const [message, setMessage] = useState<{
		type: 'success' | 'error' | 'info';
		text: string;
	} | null>(null);

	const fetchSectors = useCallback(async () => {
		try {
			const response = await fetch('/api/sectors');
			if (response.ok) {
				const data = await response.json();
				setSectors(data);
			} else {
				setMessage({ type: 'error', text: 'Failed to load sectors' });
			}
		} catch (error) {
			setMessage({ type: 'error', text: 'Error loading sectors' });
		} finally {
			setLoadingSectors(false);
		}
	}, []);

	const fetchStockQuote = useCallback(
		async (ticker: string) => {
			if (!ticker || ticker.length < 2) return;

			setLoadingQuote(true);
			try {
				const response = await fetch(
					`/api/yahoo-finance/quote/${ticker.toUpperCase()}`,
				);
				if (response.ok) {
					const data = await response.json();
					setStockQuote(data);
					if (data.longName && !formData.companyName) {
						setFormData((prev) => ({ ...prev, companyName: data.longName }));
					}
					setMessage({
						type: 'info',
						text: `Found: ${data.shortName || data.longName}`,
					});
				} else {
					setStockQuote(null);
					setMessage({ type: 'error', text: 'Stock ticker not found' });
				}
			} catch (error) {
				setStockQuote(null);
				setMessage({ type: 'error', text: 'Error fetching stock data' });
			} finally {
				setLoadingQuote(false);
			}
		},
		[formData.companyName],
	);

	// Fetch sectors on component mount
	useEffect(() => {
		fetchSectors();
	}, [fetchSectors]);

	// Debounced ticker lookup
	useEffect(() => {
		const timer = setTimeout(() => {
			if (formData.ticker && formData.ticker.length >= 2) {
				fetchStockQuote(formData.ticker);
			}
		}, 800);

		return () => clearTimeout(timer);
	}, [formData.ticker, fetchStockQuote]);

	const handleInputChange =
		(field: keyof FormData) =>
		(
			event:
				| React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
				| { target: { value: unknown } },
		) => {
			setFormData((prev) => ({
				...prev,
				[field]: event.target.value,
			}));
			// Clear messages when user starts typing
			if (message && message.type !== 'info') {
				setMessage(null);
			}
		};

	const handleTickerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value.toUpperCase();
		setFormData((prev) => ({ ...prev, ticker: value }));
		setStockQuote(null);
		if (message && message.type !== 'error') {
			setMessage(null);
		}
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setLoading(true);
		setMessage(null);

		// Validate form
		if (!formData.ticker || !formData.companyName || !formData.sectorId) {
			setMessage({ type: 'error', text: 'All fields are required' });
			setLoading(false);
			return;
		}

		try {
			const response = await fetch('/api/stocks', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (response.ok) {
				setMessage({
					type: 'success',
					text: `Stock ${data.ticker} (${data.companyName}) added successfully!`,
				});
				// Reset form
				setFormData({
					ticker: '',
					companyName: '',
					sectorId: '',
				});
				setStockQuote(null);
			} else {
				setMessage({
					type: 'error',
					text: data.error || 'Failed to add stock',
				});
			}
		} catch (error) {
			setMessage({ type: 'error', text: 'Network error occurred' });
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container maxWidth="xl">
			<Box sx={{ py: 4 }}>
				<Typography variant="h4" component="h1" gutterBottom>
					Add New Stock
				</Typography>
				<Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
					Add a new stock to your portfolio management system
				</Typography>

				<Box
					sx={{
						display: 'flex',
						gap: 3,
						flexDirection: { xs: 'column', lg: 'row' },
					}}
				>
					<Box sx={{ flex: 2 }}>
						<Card elevation={2} sx={{ p: 4 }}>
							{message && (
								<Alert severity={message.type} sx={{ mb: 3 }}>
									{message.text}
								</Alert>
							)}

							<Box component="form" onSubmit={handleSubmit}>
								<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
									<Box
										sx={{
											display: 'flex',
											gap: 2,
											flexDirection: { xs: 'column', sm: 'row' },
										}}
									>
										<Autocomplete
											freeSolo
											options={POPULAR_TICKERS}
											value={formData.ticker}
											onInputChange={(event, newInputValue) => {
												setFormData((prev) => ({
													...prev,
													ticker: newInputValue.toUpperCase(),
												}));
												setStockQuote(null);
											}}
											renderInput={(params) => (
												<TextField
													{...params}
													fullWidth
													label="Stock Ticker"
													placeholder="e.g., AAPL, GOOGL"
													required
													disabled={loading}
													inputProps={{
														...params.inputProps,
														style: { textTransform: 'uppercase' },
													}}
													helperText="Start typing or select from popular stocks"
													InputProps={{
														...params.InputProps,
														endAdornment: (
															<>
																{loadingQuote && <CircularProgress size={20} />}
																{params.InputProps.endAdornment}
															</>
														),
													}}
												/>
											)}
											sx={{ flex: 1 }}
										/>

										<FormControl
											fullWidth
											required
											disabled={loadingSectors || loading}
											sx={{ flex: 1 }}
										>
											<InputLabel>Sector</InputLabel>
											<Select
												value={formData.sectorId}
												label="Sector"
												onChange={handleInputChange('sectorId')}
											>
												{sectors.map((sector) => (
													<MenuItem key={sector.id} value={sector.id}>
														{sector.name}
													</MenuItem>
												))}
											</Select>
											{loadingSectors && (
												<Box
													sx={{
														display: 'flex',
														justifyContent: 'center',
														mt: 1,
													}}
												>
													<CircularProgress size={20} />
												</Box>
											)}
										</FormControl>
									</Box>

									<TextField
										fullWidth
										label="Company Name"
										value={formData.companyName}
										onChange={handleInputChange('companyName')}
										placeholder="e.g., Apple Inc., Alphabet Inc."
										required
										disabled={loading}
										helperText="Full company name (auto-filled from ticker if available)"
									/>

									<Box
										sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}
									>
										<Button
											type="button"
											variant="outlined"
											disabled={loading}
											onClick={() => {
												setFormData({
													ticker: '',
													companyName: '',
													sectorId: '',
												});
												setMessage(null);
												setStockQuote(null);
											}}
										>
											Reset
										</Button>
										<Button
											type="submit"
											variant="contained"
											disabled={loading || loadingSectors}
											startIcon={
												loading ? <CircularProgress size={20} /> : <AddIcon />
											}
										>
											{loading ? 'Adding...' : 'Add Stock'}
										</Button>
									</Box>
								</Box>
							</Box>
						</Card>
					</Box>

					<Box sx={{ flex: 1 }}>
						{stockQuote && (
							<Card elevation={2}>
								<CardContent>
									<Typography variant="h6" gutterBottom>
										Stock Preview
									</Typography>
									<Box
										sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
									>
										<Box
											sx={{ display: 'flex', justifyContent: 'space-between' }}
										>
											<Typography variant="body2" color="text.secondary">
												Symbol:
											</Typography>
											<Chip label={stockQuote.symbol} size="small" />
										</Box>
										<Box
											sx={{ display: 'flex', justifyContent: 'space-between' }}
										>
											<Typography variant="body2" color="text.secondary">
												Company:
											</Typography>
											<Typography
												variant="body2"
												sx={{ textAlign: 'right', flex: 1, ml: 1 }}
											>
												{stockQuote.shortName}
											</Typography>
										</Box>
										{stockQuote.regularMarketPrice && (
											<Box
												sx={{
													display: 'flex',
													justifyContent: 'space-between',
												}}
											>
												<Typography variant="body2" color="text.secondary">
													Price:
												</Typography>
												<Typography variant="body2" color="primary">
													{stockQuote.currency}{' '}
													{stockQuote.regularMarketPrice.toFixed(2)}
												</Typography>
											</Box>
										)}
									</Box>
								</CardContent>
							</Card>
						)}

						<Card elevation={1} sx={{ mt: stockQuote ? 2 : 0 }}>
							<CardContent>
								<Typography variant="h6" gutterBottom>
									Popular Stocks
								</Typography>
								<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
									{POPULAR_TICKERS.slice(0, 12).map((ticker) => (
										<Chip
											key={ticker}
											label={ticker}
											size="small"
											onClick={() => {
												setFormData((prev) => ({ ...prev, ticker }));
												setStockQuote(null);
											}}
											sx={{ cursor: 'pointer' }}
										/>
									))}
								</Box>
							</CardContent>
						</Card>
					</Box>
				</Box>
			</Box>
		</Container>
	);
}
