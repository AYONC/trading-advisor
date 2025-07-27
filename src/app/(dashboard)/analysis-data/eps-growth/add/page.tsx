'use client';

import { Add as AddIcon } from '@mui/icons-material';
import {
	Alert,
	Box,
	Button,
	Card,
	CardContent,
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
import BulkUploadEpsGrowth from '@/components/BulkUploadEpsGrowth';

interface Stock {
	id: number;
	ticker: string;
	companyName: string;
	sector: {
		id: number;
		name: string;
	};
}

interface FormData {
	stockId: number | '';
	period: number | '';
	year: number | '';
	value: number | '';
}

export default function AddEpsGrowthPage() {
	const [formData, setFormData] = useState<FormData>({
		stockId: '',
		period: '',
		year: '',
		value: '',
	});
	const [stocks, setStocks] = useState<Stock[]>([]);
	const [loading, setLoading] = useState(false);
	const [loadingStocks, setLoadingStocks] = useState(true);
	const [message, setMessage] = useState<{
		type: 'success' | 'error' | 'info';
		text: string;
	} | null>(null);

	const fetchStocks = useCallback(async () => {
		try {
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
			setLoadingStocks(false);
		}
	}, []);

	// Fetch stocks on component mount
	useEffect(() => {
		fetchStocks();
	}, [fetchStocks]);

	const handleInputChange =
		(field: keyof FormData) =>
		(
			event:
				| React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
				| { target: { value: unknown } },
		) => {
			const value = event.target.value;
			setFormData((prev) => ({
				...prev,
				[field]: value,
			}));
			// Clear messages when user starts typing
			if (message && message.type !== 'info') {
				setMessage(null);
			}
		};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setLoading(true);
		setMessage(null);

		// Validate required fields
		if (
			!formData.stockId ||
			formData.period === '' ||
			formData.year === '' ||
			formData.value === ''
		) {
			setMessage({ type: 'error', text: 'All fields are required' });
			setLoading(false);
			return;
		}

		// Validate numeric ranges
		if (formData.period < 0 || !Number.isInteger(Number(formData.period))) {
			setMessage({
				type: 'error',
				text: 'Period must be an integer greater than or equal to 0',
			});
			setLoading(false);
			return;
		}

		if (formData.year < 1900 || formData.year > 2100) {
			setMessage({ type: 'error', text: 'Year must be between 1900 and 2100' });
			setLoading(false);
			return;
		}

		if (formData.value < -10 || formData.value > 10) {
			setMessage({
				type: 'error',
				text: 'Value must be between -10 and 10',
			});
			setLoading(false);
			return;
		}

		try {
			// Prepare data for submission
			const submitData = {
				stockId: Number(formData.stockId),
				period: Number(formData.period),
				year: Number(formData.year),
				value: Number(formData.value),
			};

			const response = await fetch('/api/eps-growth', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(submitData),
			});

			const data = await response.json();

			if (response.ok) {
				const selectedStock = stocks.find((s) => s.id === formData.stockId);
				setMessage({
					type: 'success',
					text: `EPS Growth for ${selectedStock?.ticker} (${selectedStock?.companyName}) added successfully!`,
				});
				// Reset form
				setFormData({
					stockId: '',
					period: '',
					year: '',
					value: '',
				});
			} else {
				setMessage({
					type: 'error',
					text: data.error || 'Failed to add EPS Growth',
				});
			}
		} catch (error) {
			setMessage({ type: 'error', text: 'Network error occurred' });
		} finally {
			setLoading(false);
		}
	};

	const selectedStock = stocks.find((stock) => stock.id === formData.stockId);

	const handleBulkUploadSuccess = (result: any) => {
		setMessage({
			type: 'success',
			text: `Bulk upload completed: ${result.successCount} records added successfully!`,
		});
		// Optional: Refresh or update any data if needed
	};

	return (
		<Container maxWidth="xl">
			<Box sx={{ py: 4 }}>
				<Typography variant="h4" component="h1" gutterBottom>
					Add EPS Growth
				</Typography>
				<Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
					Add EPS growth data for stock analysis
				</Typography>

				{/* Bulk Upload Section */}
				<Box sx={{ mb: 4 }}>
					<BulkUploadEpsGrowth onSuccess={handleBulkUploadSuccess} />
				</Box>

				{/* Divider */}
				<Box sx={{ display: 'flex', alignItems: 'center', my: 4 }}>
					<Box sx={{ flexGrow: 1, height: '1px', bgcolor: 'divider' }} />
					<Typography
						variant="body2"
						sx={{
							px: 2,
							color: 'text.secondary',
							backgroundColor: 'background.paper',
						}}
					>
						OR ADD SINGLE RECORD
					</Typography>
					<Box sx={{ flexGrow: 1, height: '1px', bgcolor: 'divider' }} />
				</Box>

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
									{/* Stock Selection */}
									<FormControl
										fullWidth
										required
										disabled={loadingStocks || loading}
									>
										<InputLabel>Stock</InputLabel>
										<Select
											value={formData.stockId}
											label="Stock"
											onChange={handleInputChange('stockId')}
										>
											{stocks.map((stock) => (
												<MenuItem key={stock.id} value={stock.id}>
													{stock.ticker} - {stock.companyName}
												</MenuItem>
											))}
										</Select>
										{loadingStocks && (
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

									{/* Period and Year */}
									<Box
										sx={{
											display: 'flex',
											gap: 2,
											flexDirection: { xs: 'column', sm: 'row' },
										}}
									>
										<TextField
											fullWidth
											label="Period"
											type="number"
											inputProps={{ min: '0', step: '1' }}
											value={formData.period}
											onChange={handleInputChange('period')}
											placeholder="e.g., 1 or 2024"
											required
											disabled={loading}
											helperText="Analysis period (integer ≥ 0)"
											sx={{ flex: 1 }}
										/>

										<TextField
											fullWidth
											label="Year"
											type="number"
											inputProps={{ min: '1900', max: '2100' }}
											value={formData.year}
											onChange={handleInputChange('year')}
											placeholder="e.g., 2024"
											required
											disabled={loading}
											helperText="Target year (1900-2100)"
											sx={{ flex: 1 }}
										/>
									</Box>

									{/* Value */}
									<TextField
										fullWidth
										label="Value"
										type="number"
										inputProps={{ step: '0.0001', min: '-10', max: '10' }}
										value={formData.value}
										onChange={handleInputChange('value')}
										placeholder="0.0000"
										required
										disabled={loading}
										helperText="EPS growth value (-10 to 10, e.g., 0.15 for 15%)"
									/>

									{/* Action Buttons */}
									<Box
										sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}
									>
										<Button
											type="button"
											variant="outlined"
											disabled={loading}
											onClick={() => {
												setFormData({
													stockId: '',
													period: '',
													year: '',
													value: '',
												});
												setMessage(null);
											}}
										>
											Reset
										</Button>
										<Button
											type="submit"
											variant="contained"
											disabled={loading || loadingStocks}
											startIcon={
												loading ? <CircularProgress size={20} /> : <AddIcon />
											}
										>
											{loading ? 'Adding...' : 'Add Record'}
										</Button>
									</Box>
								</Box>
							</Box>
						</Card>
					</Box>

					{/* Preview Card */}
					<Box sx={{ flex: 1 }}>
						{selectedStock && (
							<Card elevation={2}>
								<CardContent>
									<Typography variant="h6" gutterBottom>
										Selected Stock
									</Typography>
									<Box
										sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
									>
										<Box
											sx={{ display: 'flex', justifyContent: 'space-between' }}
										>
											<Typography variant="body2" color="text.secondary">
												Ticker:
											</Typography>
											<Typography variant="body2" fontWeight="bold">
												{selectedStock.ticker}
											</Typography>
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
												{selectedStock.companyName}
											</Typography>
										</Box>
										<Box
											sx={{ display: 'flex', justifyContent: 'space-between' }}
										>
											<Typography variant="body2" color="text.secondary">
												Sector:
											</Typography>
											<Typography variant="body2">
												{selectedStock.sector.name}
											</Typography>
										</Box>
									</Box>
								</CardContent>
							</Card>
						)}

						<Card elevation={1} sx={{ mt: selectedStock ? 2 : 0 }}>
							<CardContent>
								<Typography variant="h6" gutterBottom>
									Field Descriptions
								</Typography>
								<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
									<Typography variant="body2">
										<strong>Period:</strong> Analysis period (integer ≥ 0)
									</Typography>
									<Typography variant="body2">
										<strong>Year:</strong> Target year for growth calculation
									</Typography>
									<Typography variant="body2">
										<strong>Value:</strong> EPS growth rate (as decimal, -10 to
										10)
									</Typography>
								</Box>
							</CardContent>
						</Card>
					</Box>
				</Box>
			</Box>
		</Container>
	);
}
