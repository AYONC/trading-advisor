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
import BulkUploadRevenueAnalysis from '@/components/BulkUploadRevenueAnalysis';

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
	price: number | '';
	ps: number | '';
	operatingMargin: number | '';
	salesGrowthAdjustedRate: number | '';
}

export default function AddRevenueAnalysisPage() {
	const [formData, setFormData] = useState<FormData>({
		stockId: '',
		period: '',
		price: '',
		ps: '',
		operatingMargin: '',
		salesGrowthAdjustedRate: '',
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
			formData.price === '' ||
			formData.ps === '' ||
			formData.operatingMargin === ''
		) {
			setMessage({ type: 'error', text: 'All required fields must be filled' });
			setLoading(false);
			return;
		}

		// Validate numeric ranges
		if (formData.price < 0) {
			setMessage({ type: 'error', text: 'Price must be positive' });
			setLoading(false);
			return;
		}

		if (formData.ps < 0) {
			setMessage({ type: 'error', text: 'P/S ratio must be positive' });
			setLoading(false);
			return;
		}

		if (formData.operatingMargin < -1 || formData.operatingMargin > 1) {
			setMessage({
				type: 'error',
				text: 'Operating Margin must be between -1 and 1 (-100% to 100%)',
			});
			setLoading(false);
			return;
		}

		if (
			formData.salesGrowthAdjustedRate !== '' &&
			(formData.salesGrowthAdjustedRate < -1 ||
				formData.salesGrowthAdjustedRate > 10)
		) {
			setMessage({
				type: 'error',
				text: 'Sales Growth Adjusted Rate must be between -1 and 10',
			});
			setLoading(false);
			return;
		}

		try {
			// Prepare data for submission
			const submitData = {
				stockId: Number(formData.stockId),
				period: Number(formData.period),
				price: Number(formData.price),
				ps: Number(formData.ps),
				operatingMargin: Number(formData.operatingMargin),
				salesGrowthAdjustedRate: formData.salesGrowthAdjustedRate
					? Number(formData.salesGrowthAdjustedRate)
					: null,
			};

			const response = await fetch('/api/revenue-analysis', {
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
					text: `Revenue analysis for ${selectedStock?.ticker} (${selectedStock?.companyName}) added successfully!`,
				});
				// Reset form
				setFormData({
					stockId: '',
					period: '',
					price: '',
					ps: '',
					operatingMargin: '',
					salesGrowthAdjustedRate: '',
				});
			} else {
				setMessage({
					type: 'error',
					text: data.error || 'Failed to add revenue analysis',
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
			text: `Bulk upload completed: ${result.successCount} analyses added successfully!`,
		});
		// Optional: Refresh or update any data if needed
	};

	return (
		<Container maxWidth="xl">
			<Box sx={{ py: 4 }}>
				<Typography variant="h4" component="h1" gutterBottom>
					Add Revenue Stock Analysis
				</Typography>
				<Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
					Add financial analysis data for stock revenue performance
				</Typography>

				{/* Bulk Upload Section */}
				<Box sx={{ mb: 4 }}>
					<BulkUploadRevenueAnalysis onSuccess={handleBulkUploadSuccess} />
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
						OR ADD SINGLE ANALYSIS
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

									{/* Period and Price */}
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
											value={formData.period}
											onChange={handleInputChange('period')}
											placeholder="e.g., 2024"
											required
											disabled={loading}
											helperText="Analysis period (e.g., year)"
											sx={{ flex: 1 }}
										/>

										<TextField
											fullWidth
											label="Stock Price"
											type="number"
											inputProps={{ step: '0.01', min: '0' }}
											value={formData.price}
											onChange={handleInputChange('price')}
											placeholder="0.00"
											required
											disabled={loading}
											helperText="Current stock price"
											sx={{ flex: 1 }}
										/>
									</Box>

									{/* P/S and Operating Margin */}
									<Box
										sx={{
											display: 'flex',
											gap: 2,
											flexDirection: { xs: 'column', sm: 'row' },
										}}
									>
										<TextField
											fullWidth
											label="P/S Ratio"
											type="number"
											inputProps={{ step: '0.0001', min: '0' }}
											value={formData.ps}
											onChange={handleInputChange('ps')}
											placeholder="0.0000"
											required
											disabled={loading}
											helperText="Price-to-Sales ratio (forward)"
											sx={{ flex: 1 }}
										/>

										<TextField
											fullWidth
											label="Operating Margin"
											type="number"
											inputProps={{ step: '0.0001', min: '-1', max: '1' }}
											value={formData.operatingMargin}
											onChange={handleInputChange('operatingMargin')}
											placeholder="0.0000"
											required
											disabled={loading}
											helperText="Operating margin (-1 to 1, e.g., 0.25 for 25%)"
											sx={{ flex: 1 }}
										/>
									</Box>

									{/* Sales Growth Adjusted Rate (Optional) */}
									<TextField
										fullWidth
										label="Sales Growth Adjusted Rate (Optional)"
										type="number"
										inputProps={{ step: '0.0001', min: '-1', max: '10' }}
										value={formData.salesGrowthAdjustedRate}
										onChange={handleInputChange('salesGrowthAdjustedRate')}
										placeholder="0.0000"
										disabled={loading}
										helperText="Sales growth adjustment rate (optional, e.g., 0.15 for 15%)"
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
													price: '',
													ps: '',
													operatingMargin: '',
													salesGrowthAdjustedRate: '',
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
											{loading ? 'Adding...' : 'Add Analysis'}
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
										<strong>Period:</strong> Analysis time period (e.g., year)
									</Typography>
									<Typography variant="body2">
										<strong>P/S Ratio:</strong> Price-to-Sales ratio (forward)
									</Typography>
									<Typography variant="body2">
										<strong>Operating Margin:</strong> Operating profit margin
										(as decimal, -1 to 1)
									</Typography>
									<Typography variant="body2">
										<strong>Sales Growth Rate:</strong> Optional sales growth
										adjustment
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
