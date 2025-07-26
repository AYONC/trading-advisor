'use client';

import { Add as AddIcon } from '@mui/icons-material';
import {
	Box,
	Paper,
	Typography,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Button,
	Alert,
	CircularProgress,
	Container,
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

export default function AddStockPage() {
	const [formData, setFormData] = useState<FormData>({
		ticker: '',
		companyName: '',
		sectorId: '',
	});
	const [sectors, setSectors] = useState<Sector[]>([]);
	const [loading, setLoading] = useState(false);
	const [loadingSectors, setLoadingSectors] = useState(true);
	const [message, setMessage] = useState<{
		type: 'success' | 'error';
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

	// Fetch sectors on component mount
	useEffect(() => {
		fetchSectors();
	}, [fetchSectors]);

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
			if (message) {
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
					text: `Stock ${data.ticker} added successfully!`,
				});
				// Reset form
				setFormData({
					ticker: '',
					companyName: '',
					sectorId: '',
				});
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
		<Container maxWidth="md">
			<Box sx={{ py: 4 }}>
				<Typography variant="h4" component="h1" gutterBottom>
					Add New Stock
				</Typography>
				<Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
					Add a new stock to your portfolio management system
				</Typography>

				<Paper elevation={2} sx={{ p: 4 }}>
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
								<TextField
									fullWidth
									label="Stock Ticker"
									value={formData.ticker}
									onChange={handleInputChange('ticker')}
									placeholder="e.g., AAPL, GOOGL"
									required
									disabled={loading}
									inputProps={{ style: { textTransform: 'uppercase' } }}
									helperText="Stock symbol (will be converted to uppercase)"
								/>

								<FormControl
									fullWidth
									required
									disabled={loadingSectors || loading}
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
											sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}
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
								helperText="Full company name"
							/>

							<Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
								<Button
									type="button"
									variant="outlined"
									disabled={loading}
									onClick={() => {
										setFormData({ ticker: '', companyName: '', sectorId: '' });
										setMessage(null);
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
				</Paper>
			</Box>
		</Container>
	);
}
