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
import BulkUploadEarningAnalysis from '@/components/BulkUploadEarningAnalysis';

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
	pe: number | '';
	roa: number | '';
	epsRevisionGrade: string;
	epsGrowthAdjustedRate: number | '';
}

const EPS_REVISION_GRADES = [
	{ value: 'A+', label: 'A+ (Excellent+)' },
	{ value: 'A', label: 'A (Excellent)' },
	{ value: 'A-', label: 'A- (Excellent-)' },
	{ value: 'B+', label: 'B+ (Good+)' },
	{ value: 'B', label: 'B (Good)' },
	{ value: 'B-', label: 'B- (Good-)' },
	{ value: 'C+', label: 'C+ (Average+)' },
	{ value: 'C', label: 'C (Average)' },
	{ value: 'C-', label: 'C- (Average-)' },
	{ value: 'D+', label: 'D+ (Poor+)' },
	{ value: 'D', label: 'D (Poor)' },
	{ value: 'D-', label: 'D- (Poor-)' },
	{ value: 'E', label: 'E (Very Poor)' },
];

export default function AddEarningAnalysisPage() {
	const [formData, setFormData] = useState<FormData>({
		stockId: '',
		period: '',
		price: '',
		pe: '',
		roa: '',
		epsRevisionGrade: '',
		epsGrowthAdjustedRate: '',
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
			formData.pe === '' ||
			formData.roa === '' ||
			!formData.epsRevisionGrade
		) {
			setMessage({ type: 'error', text: 'All required fields must be filled' });
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

		if (formData.pe < 0 || formData.pe > 1000) {
			setMessage({
				type: 'error',
				text: 'P/E ratio must be between 0 and 1000',
			});
			setLoading(false);
			return;
		}

		if (formData.roa < 0 || formData.roa > 1) {
			setMessage({
				type: 'error',
				text: 'ROA must be between 0 and 1 (0% to 100%)',
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
				pe: Number(formData.pe),
				roa: Number(formData.roa),
				epsRevisionGrade: formData.epsRevisionGrade,
				epsGrowthAdjustedRate: formData.epsGrowthAdjustedRate
					? Number(formData.epsGrowthAdjustedRate)
					: null,
			};

			const response = await fetch('/api/earning-analysis', {
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
					text: `Earning analysis for ${selectedStock?.ticker} (${selectedStock?.companyName}) added successfully!`,
				});
				// Reset form
				setFormData({
					stockId: '',
					period: '',
					price: '',
					pe: '',
					roa: '',
					epsRevisionGrade: '',
					epsGrowthAdjustedRate: '',
				});
			} else {
				setMessage({
					type: 'error',
					text: data.error || 'Failed to add earning analysis',
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
					Add Earning Stock Analysis
				</Typography>
				<Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
					Add financial analysis data for stock earning performance
				</Typography>

				{/* Bulk Upload Section */}
				<Box sx={{ mb: 4 }}>
					<BulkUploadEarningAnalysis onSuccess={handleBulkUploadSuccess} />
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

									{/* P/E and ROA */}
									<Box
										sx={{
											display: 'flex',
											gap: 2,
											flexDirection: { xs: 'column', sm: 'row' },
										}}
									>
										<TextField
											fullWidth
											label="P/E Ratio"
											type="number"
											inputProps={{ step: '0.01', min: '0', max: '1000' }}
											value={formData.pe}
											onChange={handleInputChange('pe')}
											placeholder="0.00"
											required
											disabled={loading}
											helperText="Price-to-Earnings ratio (0-1000)"
											sx={{ flex: 1 }}
										/>

										<TextField
											fullWidth
											label="ROA"
											type="number"
											inputProps={{ step: '0.0001', min: '0', max: '1' }}
											value={formData.roa}
											onChange={handleInputChange('roa')}
											placeholder="0.0000"
											required
											disabled={loading}
											helperText="Return on Assets (0-1, e.g., 0.15 for 15%)"
											sx={{ flex: 1 }}
										/>
									</Box>

									{/* EPS Revision Grade */}
									<FormControl fullWidth required disabled={loading}>
										<InputLabel>EPS Revision Grade</InputLabel>
										<Select
											value={formData.epsRevisionGrade}
											label="EPS Revision Grade"
											onChange={handleInputChange('epsRevisionGrade')}
										>
											{EPS_REVISION_GRADES.map((grade) => (
												<MenuItem key={grade.value} value={grade.value}>
													{grade.label}
												</MenuItem>
											))}
										</Select>
									</FormControl>

									{/* EPS Growth Adjusted Rate (Optional) */}
									<TextField
										fullWidth
										label="EPS Growth Adjusted Rate (Optional)"
										type="number"
										inputProps={{ step: '0.0001', min: '0', max: '10' }}
										value={formData.epsGrowthAdjustedRate}
										onChange={handleInputChange('epsGrowthAdjustedRate')}
										placeholder="0.0000"
										disabled={loading}
										helperText="EPS growth adjustment rate (optional, e.g., 0.05 for 5%)"
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
													pe: '',
													roa: '',
													epsRevisionGrade: '',
													epsGrowthAdjustedRate: '',
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
										<strong>Period:</strong> Analysis period (integer ≥ 0)
									</Typography>
									<Typography variant="body2">
										<strong>P/E Ratio:</strong> Price-to-Earnings ratio
									</Typography>
									<Typography variant="body2">
										<strong>ROA:</strong> Return on Assets (as decimal, 0-1)
									</Typography>
									<Typography variant="body2">
										<strong>EPS Grade:</strong> Earnings per Share revision
										grade
									</Typography>
									<Typography variant="body2">
										<strong>Growth Rate:</strong> Optional EPS growth adjustment
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
