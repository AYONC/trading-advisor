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
import BulkUploadSalesGrowth from '@/components/BulkUploadSalesGrowth';

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

export default function AddSalesGrowthPage() {
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
		setLoadingStocks(true);
		try {
			const response = await fetch('/api/stocks');
			if (response.ok) {
				const data = await response.json();
				setStocks(data);
			} else {
				console.error('Failed to fetch stocks');
			}
		} catch (error) {
			console.error('Error fetching stocks:', error);
		} finally {
			setLoadingStocks(false);
		}
	}, []);

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
			setMessage({
				type: 'error',
				text: 'Year must be between 1900 and 2100',
			});
			setLoading(false);
			return;
		}

		try {
			const response = await fetch('/api/sales-growth', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			const result = await response.json();

			if (response.ok) {
				setMessage({
					type: 'success',
					text: 'Sales growth data added successfully!',
				});
				setFormData({
					stockId: '',
					period: '',
					year: '',
					value: '',
				});
			} else {
				setMessage({
					type: 'error',
					text: result.error || 'Failed to add sales growth data',
				});
			}
		} catch (error) {
			console.error('Error submitting form:', error);
			setMessage({
				type: 'error',
				text: 'An error occurred while adding the data',
			});
		} finally {
			setLoading(false);
		}
	};

	const selectedStock = stocks.find((stock) => stock.id === formData.stockId);

	const handleBulkUploadSuccess = useCallback((result: any) => {
		setMessage({
			type: 'success',
			text: `Bulk upload completed: ${result.successCount} sales growth records added successfully!`,
		});
	}, []);

	return (
		<Container maxWidth="xl">
			<Box sx={{ py: 4 }}>
				<Typography variant="h4" component="h1" gutterBottom>
					Add Sales Growth
				</Typography>
				<Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
					Add sales growth data for stock analysis
				</Typography>

				{/* Bulk Upload Section */}
				<Box sx={{ mb: 4 }}>
					<BulkUploadSalesGrowth onSuccess={handleBulkUploadSuccess} />
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
											helperText="Year (1900-2100)"
											sx={{ flex: 1 }}
										/>
									</Box>

									{/* Value */}
									<TextField
										fullWidth
										label="Value"
										type="number"
										inputProps={{ step: '0.0001' }}
										value={formData.value}
										onChange={handleInputChange('value')}
										placeholder="e.g., 0.15"
										required
										disabled={loading}
										helperText="Sales growth value (decimal)"
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
											{loading ? 'Adding...' : 'Add Sales Growth'}
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
										<strong>Value:</strong> Sales growth rate (as decimal)
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
