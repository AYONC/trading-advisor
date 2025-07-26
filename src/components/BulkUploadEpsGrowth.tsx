'use client';

import {
	CheckCircle as CheckCircleIcon,
	CloudUpload as CloudUploadIcon,
	Download as DownloadIcon,
	Error as ErrorIcon,
} from '@mui/icons-material';
import {
	Alert,
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	LinearProgress,
	styled,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import Papa from 'papaparse';
import { useCallback, useState } from 'react';
import * as XLSX from 'xlsx';

interface BulkEpsGrowthData {
	ticker: string;
	period: number;
	year: number;
	value: number;
}

interface ValidationError {
	row: number;
	field: string;
	value: any;
	error: string;
}

interface BulkResult {
	success: BulkEpsGrowthData[];
	errors: Array<{
		data: BulkEpsGrowthData;
		error: string;
	}>;
	total: number;
	successCount: number;
	errorCount: number;
}

const VisuallyHiddenInput = styled('input')({
	clip: 'rect(0 0 0 0)',
	clipPath: 'inset(50%)',
	height: 1,
	overflow: 'hidden',
	position: 'absolute',
	bottom: 0,
	left: 0,
	whiteSpace: 'nowrap',
	width: 1,
});

const EXPECTED_HEADERS = ['ticker', 'period', 'year', 'value'];

interface BulkUploadEpsGrowthProps {
	onSuccess?: (result: BulkResult) => void;
}

export default function BulkUploadEpsGrowth({
	onSuccess,
}: BulkUploadEpsGrowthProps) {
	const [file, setFile] = useState<File | null>(null);
	const [parsedData, setParsedData] = useState<BulkEpsGrowthData[]>([]);
	const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
		[],
	);
	const [uploading, setUploading] = useState(false);
	const [uploadResult, setUploadResult] = useState<BulkResult | null>(null);
	const [previewOpen, setPreviewOpen] = useState(false);
	const [resultDialogOpen, setResultDialogOpen] = useState(false);

	const validateData = useCallback((data: any[]): ValidationError[] => {
		const errors: ValidationError[] = [];

		data.forEach((row, index) => {
			// Check required fields
			if (!row.ticker || typeof row.ticker !== 'string') {
				errors.push({
					row: index + 1,
					field: 'ticker',
					value: row.ticker,
					error: 'Ticker is required and must be a string',
				});
			}

			if (!row.period || isNaN(Number(row.period))) {
				errors.push({
					row: index + 1,
					field: 'period',
					value: row.period,
					error: 'Period is required and must be a number',
				});
			}

			if (!row.year || isNaN(Number(row.year))) {
				errors.push({
					row: index + 1,
					field: 'year',
					value: row.year,
					error: 'Year is required and must be a number',
				});
			}

			if (row.value === undefined || isNaN(Number(row.value))) {
				errors.push({
					row: index + 1,
					field: 'value',
					value: row.value,
					error: 'Value is required and must be a number',
				});
			}

			// Validate ranges
			if (
				row.period !== undefined &&
				(Number(row.period) < 0 || !Number.isInteger(Number(row.period)))
			) {
				errors.push({
					row: index + 1,
					field: 'period',
					value: row.period,
					error: 'Period must be an integer greater than or equal to 0',
				});
			}

			if (
				row.year !== undefined &&
				(Number(row.year) < 1900 || Number(row.year) > 2100)
			) {
				errors.push({
					row: index + 1,
					field: 'year',
					value: row.year,
					error: 'Year must be between 1900 and 2100',
				});
			}

			if (
				row.value !== undefined &&
				(Number(row.value) < -10 || Number(row.value) > 10)
			) {
				errors.push({
					row: index + 1,
					field: 'value',
					value: row.value,
					error: 'Value must be between -10 and 10',
				});
			}
		});

		return errors;
	}, []);

	const parseFile = useCallback(
		(file: File) => {
			const fileExtension = file.name.split('.').pop()?.toLowerCase();

			if (fileExtension === 'csv') {
				Papa.parse(file, {
					header: true,
					skipEmptyLines: true,
					complete: (results) => {
						const data = results.data as any[];
						const errors = validateData(data);
						setValidationErrors(errors);

						if (errors.length === 0) {
							const processedData: BulkEpsGrowthData[] = data.map((row) => ({
								ticker: String(row.ticker).toUpperCase(),
								period: Number(row.period),
								year: Number(row.year),
								value: Number(row.value),
							}));
							setParsedData(processedData);
						}
					},
					error: (error) => {
						console.error('CSV parsing error:', error);
						setValidationErrors([
							{
								row: 0,
								field: 'file',
								value: file.name,
								error: `CSV parsing error: ${error.message}`,
							},
						]);
					},
				});
			} else if (['xlsx', 'xls'].includes(fileExtension || '')) {
				const reader = new FileReader();
				reader.onload = (e) => {
					try {
						const data = new Uint8Array(e.target?.result as ArrayBuffer);
						const workbook = XLSX.read(data, { type: 'array' });
						const sheetName = workbook.SheetNames[0];
						const worksheet = workbook.Sheets[sheetName];
						const jsonData = XLSX.utils.sheet_to_json(worksheet);

						const errors = validateData(jsonData);
						setValidationErrors(errors);

						if (errors.length === 0) {
							const processedData: BulkEpsGrowthData[] = jsonData.map(
								(row: any) => ({
									ticker: String(row.ticker || row.Ticker || '').toUpperCase(),
									period: Number(row.period || row.Period),
									year: Number(row.year || row.Year),
									value: Number(row.value || row.Value),
								}),
							);
							setParsedData(processedData);
						}
					} catch (error) {
						console.error('Excel parsing error:', error);
						setValidationErrors([
							{
								row: 0,
								field: 'file',
								value: file.name,
								error: `Excel parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`,
							},
						]);
					}
				};
				reader.readAsArrayBuffer(file);
			} else {
				setValidationErrors([
					{
						row: 0,
						field: 'file',
						value: file.name,
						error: 'Unsupported file format. Please use CSV or Excel files.',
					},
				]);
			}
		},
		[validateData],
	);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = event.target.files?.[0];
		if (selectedFile) {
			setFile(selectedFile);
			setParsedData([]);
			setValidationErrors([]);
			setUploadResult(null);
			parseFile(selectedFile);
		}
	};

	const handleUpload = async () => {
		if (parsedData.length === 0) return;

		setUploading(true);
		try {
			const response = await fetch('/api/eps-growth/bulk', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ analyses: parsedData }),
			});

			const result: BulkResult = await response.json();
			setUploadResult(result);
			setResultDialogOpen(true);

			if (onSuccess) {
				onSuccess(result);
			}
		} catch (error) {
			console.error('Upload error:', error);
			setUploadResult({
				success: [],
				errors: [
					{ data: {} as BulkEpsGrowthData, error: 'Network error occurred' },
				],
				total: parsedData.length,
				successCount: 0,
				errorCount: parsedData.length,
			});
			setResultDialogOpen(true);
		} finally {
			setUploading(false);
		}
	};

	const downloadTemplate = () => {
		const template = [
			{
				ticker: 'AAPL',
				period: 1,
				year: 2024,
				value: 0.15,
			},
			{
				ticker: 'GOOGL',
				period: 2,
				year: 2025,
				value: 0.12,
			},
		];

		const csv = Papa.unparse(template);
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = 'eps_growth_template.csv';
		link.click();
	};

	return (
		<Card elevation={2}>
			<CardContent>
				<Box sx={{ mb: 3 }}>
					<Typography variant="h6" gutterBottom>
						Bulk Upload EPS Growth
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Upload CSV or Excel files to create multiple EPS growth records at
						once
					</Typography>
				</Box>

				<Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
					<Button
						component="label"
						variant="outlined"
						startIcon={<CloudUploadIcon />}
						disabled={uploading}
					>
						Choose File
						<VisuallyHiddenInput
							type="file"
							accept=".csv,.xlsx,.xls"
							onChange={handleFileChange}
						/>
					</Button>

					<Button
						variant="text"
						startIcon={<DownloadIcon />}
						onClick={downloadTemplate}
						disabled={uploading}
					>
						Download Template
					</Button>

					{parsedData.length > 0 && (
						<Button
							variant="text"
							onClick={() => setPreviewOpen(true)}
							disabled={uploading}
						>
							Preview Data ({parsedData.length} rows)
						</Button>
					)}
				</Box>

				{file && (
					<Alert severity="info" sx={{ mb: 2 }}>
						Selected file: <strong>{file.name}</strong> (
						{Math.round(file.size / 1024)} KB)
					</Alert>
				)}

				{validationErrors.length > 0 && (
					<Alert severity="error" sx={{ mb: 2 }}>
						<Typography variant="subtitle2" gutterBottom>
							Validation Errors ({validationErrors.length}):
						</Typography>
						<Box component="ul" sx={{ margin: 0, paddingLeft: 2 }}>
							{validationErrors.slice(0, 10).map((error, index) => (
								<li key={`${error.row}-${error.field}-${index}`}>
									Row {error.row}, Field "{error.field}": {error.error}
								</li>
							))}
							{validationErrors.length > 10 && (
								<li>... and {validationErrors.length - 10} more errors</li>
							)}
						</Box>
					</Alert>
				)}

				{parsedData.length > 0 && validationErrors.length === 0 && (
					<Box sx={{ mb: 2 }}>
						<Alert severity="success" sx={{ mb: 2 }}>
							<Typography variant="subtitle2">
								✅ Data validated successfully! Ready to upload{' '}
								{parsedData.length} records.
							</Typography>
						</Alert>

						{uploading && (
							<Box sx={{ mb: 2 }}>
								<Typography variant="body2" gutterBottom>
									Uploading data...
								</Typography>
								<LinearProgress />
							</Box>
						)}

						<Button
							variant="contained"
							onClick={handleUpload}
							disabled={uploading || parsedData.length === 0}
							startIcon={
								uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />
							}
						>
							{uploading
								? 'Uploading...'
								: `Upload ${parsedData.length} Records`}
						</Button>
					</Box>
				)}

				{/* Data Preview Dialog */}
				<Dialog
					open={previewOpen}
					onClose={() => setPreviewOpen(false)}
					maxWidth="lg"
					fullWidth
				>
					<DialogTitle>Data Preview ({parsedData.length} rows)</DialogTitle>
					<DialogContent>
						<TableContainer>
							<Table size="small">
								<TableHead>
									<TableRow>
										{EXPECTED_HEADERS.map((header) => (
											<TableCell key={header} sx={{ fontWeight: 'bold' }}>
												{header}
											</TableCell>
										))}
									</TableRow>
								</TableHead>
								<TableBody>
									{parsedData.slice(0, 20).map((row, index) => (
										<TableRow
											key={`${row.ticker}-${row.period}-${row.year}-${index}`}
										>
											<TableCell>{row.ticker}</TableCell>
											<TableCell>{row.period}</TableCell>
											<TableCell>{row.year}</TableCell>
											<TableCell>{row.value}</TableCell>
										</TableRow>
									))}
									{parsedData.length > 20 && (
										<TableRow>
											<TableCell
												colSpan={4}
												align="center"
												sx={{ fontStyle: 'italic' }}
											>
												... and {parsedData.length - 20} more rows
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</TableContainer>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setPreviewOpen(false)}>Close</Button>
					</DialogActions>
				</Dialog>

				{/* Upload Result Dialog */}
				<Dialog
					open={resultDialogOpen}
					onClose={() => setResultDialogOpen(false)}
					maxWidth="md"
					fullWidth
				>
					<DialogTitle>
						{uploadResult && uploadResult.errorCount === 0
							? 'Upload Completed Successfully!'
							: 'Upload Completed with Errors'}
					</DialogTitle>
					<DialogContent>
						{uploadResult && (
							<Box>
								<Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
									<Chip
										icon={<CheckCircleIcon />}
										label={`${uploadResult.successCount} Successful`}
										color="success"
										variant="outlined"
									/>
									{uploadResult.errorCount > 0 && (
										<Chip
											icon={<ErrorIcon />}
											label={`${uploadResult.errorCount} Errors`}
											color="error"
											variant="outlined"
										/>
									)}
								</Box>

								{uploadResult.errors.length > 0 && (
									<Box>
										<Typography variant="subtitle2" gutterBottom>
											Errors:
										</Typography>
										<Box sx={{ maxHeight: 300, overflow: 'auto' }}>
											{uploadResult.errors.map((error, index) => (
												<Alert
													severity="error"
													key={`error-${error.data.ticker || 'unknown'}-${error.data.period || 0}-${error.data.year || 0}-${index}`}
													sx={{ mb: 1 }}
												>
													<Typography variant="body2">
														<strong>{error.data.ticker}</strong> (Period:{' '}
														{error.data.period}, Year: {error.data.year}):{' '}
														{error.error}
													</Typography>
												</Alert>
											))}
										</Box>
									</Box>
								)}
							</Box>
						)}
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setResultDialogOpen(false)}>Close</Button>
					</DialogActions>
				</Dialog>
			</CardContent>
		</Card>
	);
}
