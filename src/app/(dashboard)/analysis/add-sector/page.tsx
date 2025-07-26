'use client';

import { Add as AddIcon, Business as BusinessIcon } from '@mui/icons-material';
import {
	Alert,
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	CircularProgress,
	Container,
	TextField,
	Typography,
} from '@mui/material';
import { useState } from 'react';

interface FormData {
	name: string;
	description: string;
}

const COMMON_SECTORS = [
	'Technology',
	'Healthcare',
	'Financial Services',
	'Consumer Discretionary',
	'Energy',
	'Industrials',
	'Materials',
	'Real Estate',
	'Utilities',
	'Consumer Staples',
	'Telecommunications',
	'Transportation',
];

export default function AddSectorPage() {
	const [formData, setFormData] = useState<FormData>({
		name: '',
		description: '',
	});
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<{
		type: 'success' | 'error';
		text: string;
	} | null>(null);

	const handleInputChange =
		(field: keyof FormData) =>
		(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			setFormData((prev) => ({
				...prev,
				[field]: event.target.value,
			}));
			// Clear messages when user starts typing
			if (message) {
				setMessage(null);
			}
		};

	const handleSectorChipClick = (sectorName: string) => {
		setFormData((prev) => ({
			...prev,
			name: sectorName,
		}));
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setLoading(true);
		setMessage(null);

		// Validate form
		if (!formData.name.trim() || !formData.description.trim()) {
			setMessage({ type: 'error', text: 'All fields are required' });
			setLoading(false);
			return;
		}

		if (formData.name.trim().length < 2) {
			setMessage({
				type: 'error',
				text: 'Sector name must be at least 2 characters long',
			});
			setLoading(false);
			return;
		}

		if (formData.description.trim().length < 10) {
			setMessage({
				type: 'error',
				text: 'Description must be at least 10 characters long',
			});
			setLoading(false);
			return;
		}

		try {
			const response = await fetch('/api/sectors', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: formData.name.trim(),
					description: formData.description.trim(),
				}),
			});

			const data = await response.json();

			if (response.ok) {
				setMessage({
					type: 'success',
					text: `Sector "${data.name}" added successfully!`,
				});
				// Reset form
				setFormData({
					name: '',
					description: '',
				});
			} else {
				setMessage({
					type: 'error',
					text: data.error || 'Failed to add sector',
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
					Add New Sector
				</Typography>
				<Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
					Create a new business sector for categorizing stocks
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
									<TextField
										fullWidth
										label="Sector Name"
										value={formData.name}
										onChange={handleInputChange('name')}
										placeholder="e.g., Technology, Healthcare, Financial Services"
										required
										disabled={loading}
										helperText="Enter a unique sector name (minimum 2 characters)"
										inputProps={{ maxLength: 255 }}
									/>

									<TextField
										fullWidth
										label="Description"
										value={formData.description}
										onChange={handleInputChange('description')}
										placeholder="Describe what types of companies belong to this sector..."
										required
										disabled={loading}
										multiline
										rows={4}
										helperText="Provide a detailed description (minimum 10 characters)"
										inputProps={{ maxLength: 255 }}
									/>

									<Box
										sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}
									>
										<Button
											type="button"
											variant="outlined"
											disabled={loading}
											onClick={() => {
												setFormData({ name: '', description: '' });
												setMessage(null);
											}}
										>
											Reset
										</Button>
										<Button
											type="submit"
											variant="contained"
											disabled={loading}
											startIcon={
												loading ? <CircularProgress size={20} /> : <AddIcon />
											}
										>
											{loading ? 'Adding...' : 'Add Sector'}
										</Button>
									</Box>
								</Box>
							</Box>
						</Card>
					</Box>

					<Box sx={{ flex: 1 }}>
						<Card elevation={2}>
							<CardContent>
								<Typography
									variant="h6"
									gutterBottom
									sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
								>
									<BusinessIcon />
									Common Sectors
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
									sx={{ mb: 2 }}
								>
									Click on a sector name to use it as a template
								</Typography>
								<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
									{COMMON_SECTORS.map((sector) => (
										<Chip
											key={sector}
											label={sector}
											size="small"
											onClick={() => handleSectorChipClick(sector)}
											sx={{ cursor: 'pointer' }}
											disabled={loading}
										/>
									))}
								</Box>
							</CardContent>
						</Card>

						<Card elevation={1} sx={{ mt: 2 }}>
							<CardContent>
								<Typography variant="h6" gutterBottom>
									Guidelines
								</Typography>
								<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
									<Typography variant="body2" color="text.secondary">
										• Sector names should be unique and descriptive
									</Typography>
									<Typography variant="body2" color="text.secondary">
										• Descriptions help users understand what companies belong
										to this sector
									</Typography>
									<Typography variant="body2" color="text.secondary">
										• Consider standard industry classifications (GICS, NAICS)
									</Typography>
									<Typography variant="body2" color="text.secondary">
										• Sectors cannot be deleted if they have associated stocks
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
