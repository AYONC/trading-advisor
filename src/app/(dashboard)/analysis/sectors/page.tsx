'use client';

import {
	Add as AddIcon,
	Business as BusinessIcon,
	Delete as DeleteIcon,
	Edit as EditIcon,
	Tag as TagIcon,
} from '@mui/icons-material';
import {
	Alert,
	Box,
	Button,
	Chip,
	CircularProgress,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Fab,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { formatDateTime } from '@/utils/date';

interface Sector {
	id: number;
	name: string;
	description: string;
	createdAt: string;
	updatedAt: string;
}

interface FormData {
	name: string;
	description: string;
}

export default function SectorsPage() {
	const [sectors, setSectors] = useState<Sector[]>([]);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [message, setMessage] = useState<{
		type: 'success' | 'error';
		text: string;
	} | null>(null);

	// Dialog states
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingSector, setEditingSector] = useState<Sector | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [sectorToDelete, setSectorToDelete] = useState<Sector | null>(null);

	// Form data
	const [formData, setFormData] = useState<FormData>({
		name: '',
		description: '',
	});

	const fetchSectors = useCallback(async () => {
		try {
			setLoading(true);
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
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchSectors();
	}, [fetchSectors]);

	const handleOpenDialog = (sector?: Sector) => {
		if (sector) {
			setEditingSector(sector);
			setFormData({
				name: sector.name,
				description: sector.description,
			});
		} else {
			setEditingSector(null);
			setFormData({
				name: '',
				description: '',
			});
		}
		setDialogOpen(true);
		setMessage(null);
	};

	const handleCloseDialog = () => {
		setDialogOpen(false);
		setEditingSector(null);
		setFormData({ name: '', description: '' });
		setMessage(null);
	};

	const handleInputChange =
		(field: keyof FormData) =>
		(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			setFormData((prev) => ({
				...prev,
				[field]: event.target.value,
			}));
		};

	const handleSubmit = async () => {
		if (!formData.name.trim() || !formData.description.trim()) {
			setMessage({ type: 'error', text: 'Name and description are required' });
			return;
		}

		setSubmitting(true);
		setMessage(null);

		try {
			const url = editingSector
				? `/api/sectors/${editingSector.id}`
				: '/api/sectors';
			const method = editingSector ? 'PUT' : 'POST';

			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (response.ok) {
				setMessage({
					type: 'success',
					text: `Sector ${editingSector ? 'updated' : 'created'} successfully!`,
				});
				handleCloseDialog();
				await fetchSectors();
			} else {
				setMessage({
					type: 'error',
					text: data.error || 'Failed to save sector',
				});
			}
		} catch (error) {
			setMessage({ type: 'error', text: 'Network error occurred' });
		} finally {
			setSubmitting(false);
		}
	};

	const handleDeleteRequest = (sector: Sector) => {
		setSectorToDelete(sector);
		setDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (!sectorToDelete) return;

		setSubmitting(true);
		setMessage(null);

		try {
			const response = await fetch(`/api/sectors/${sectorToDelete.id}`, {
				method: 'DELETE',
			});

			const data = await response.json();

			if (response.ok) {
				setMessage({ type: 'success', text: 'Sector deleted successfully!' });
				await fetchSectors();
			} else {
				setMessage({
					type: 'error',
					text: data.error || 'Failed to delete sector',
				});
			}
		} catch (error) {
			setMessage({ type: 'error', text: 'Network error occurred' });
		} finally {
			setSubmitting(false);
			setDeleteDialogOpen(false);
			setSectorToDelete(null);
		}
	};

	const handleDeleteCancel = () => {
		setDeleteDialogOpen(false);
		setSectorToDelete(null);
	};

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
							Sector Management
						</Typography>
						<Typography variant="subtitle1" color="text.secondary">
							Manage business sectors for stock categorization
						</Typography>
					</Box>
					<Fab
						color="primary"
						onClick={() => handleOpenDialog()}
						disabled={loading}
						size="medium"
					>
						<AddIcon />
					</Fab>
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
												<BusinessIcon fontSize="small" />
												Name
											</Box>
										</TableCell>
										<TableCell>Description</TableCell>
										<TableCell>Created</TableCell>
										<TableCell>Updated</TableCell>
										<TableCell align="center">Actions</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{sectors.length === 0 ? (
										<TableRow>
											<TableCell colSpan={6} align="center" sx={{ py: 4 }}>
												<Typography color="text.secondary">
													No sectors found. Create your first sector!
												</Typography>
											</TableCell>
										</TableRow>
									) : (
										sectors.map((sector) => (
											<TableRow key={sector.id} hover>
												<TableCell>
													<Typography
														variant="body2"
														sx={{
															fontFamily: 'monospace',
															color: 'text.secondary',
															fontWeight: 'medium',
														}}
													>
														#{sector.id}
													</Typography>
												</TableCell>
												<TableCell>
													<Chip
														label={sector.name}
														variant="outlined"
														color="primary"
													/>
												</TableCell>
												<TableCell>{sector.description}</TableCell>
												<TableCell>
													{formatDateTime(sector.createdAt)}
												</TableCell>
												<TableCell>
													{formatDateTime(sector.updatedAt)}
												</TableCell>
												<TableCell align="center">
													<Box
														sx={{
															display: 'flex',
															gap: 1,
															justifyContent: 'center',
														}}
													>
														<IconButton
															size="small"
															onClick={() => handleOpenDialog(sector)}
															disabled={submitting}
														>
															<EditIcon fontSize="small" />
														</IconButton>
														<IconButton
															size="small"
															color="error"
															onClick={() => handleDeleteRequest(sector)}
															disabled={submitting}
														>
															<DeleteIcon fontSize="small" />
														</IconButton>
													</Box>
												</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</TableContainer>
					)}
				</Paper>

				{/* Add/Edit Dialog */}
				<Dialog
					open={dialogOpen}
					onClose={handleCloseDialog}
					maxWidth="sm"
					fullWidth
				>
					<DialogTitle>
						{editingSector
							? `Edit Sector #${editingSector.id}`
							: 'Add New Sector'}
					</DialogTitle>
					<DialogContent>
						{message && (
							<Alert severity={message.type} sx={{ mb: 2 }}>
								{message.text}
							</Alert>
						)}
						<Box
							sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
						>
							<TextField
								fullWidth
								label="Sector Name"
								value={formData.name}
								onChange={handleInputChange('name')}
								placeholder="e.g., Technology, Healthcare"
								required
								disabled={submitting}
							/>
							<TextField
								fullWidth
								label="Description"
								value={formData.description}
								onChange={handleInputChange('description')}
								placeholder="Brief description of the sector"
								multiline
								rows={3}
								required
								disabled={submitting}
							/>
						</Box>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleCloseDialog} disabled={submitting}>
							Cancel
						</Button>
						<Button
							onClick={handleSubmit}
							variant="contained"
							disabled={
								submitting ||
								!formData.name.trim() ||
								!formData.description.trim()
							}
							startIcon={submitting ? <CircularProgress size={20} /> : null}
						>
							{submitting ? 'Saving...' : editingSector ? 'Update' : 'Create'}
						</Button>
					</DialogActions>
				</Dialog>

				{/* Delete Confirmation Dialog */}
				<Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
					<DialogTitle>Confirm Delete</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Are you sure you want to delete the sector "{sectorToDelete?.name}
							" (ID: #{sectorToDelete?.id})? This action cannot be undone.
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleDeleteCancel} disabled={submitting}>
							Cancel
						</Button>
						<Button
							onClick={handleDeleteConfirm}
							color="error"
							variant="contained"
							disabled={submitting}
							startIcon={submitting ? <CircularProgress size={20} /> : null}
						>
							{submitting ? 'Deleting...' : 'Delete'}
						</Button>
					</DialogActions>
				</Dialog>
			</Box>
		</Container>
	);
}
