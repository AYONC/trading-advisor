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

interface BulkRevenueAnalysisData {
	ticker: string;
	period: number;
	price: number;
	ps: number;
	operatingMargin: number;
	salesGrowthAdjustedRate?: number;
}

interface ValidationError {
	row: number;
	field: string;
	value: any;
	error: string;
}

interface BulkResult {
	success: BulkRevenueAnalysisData[];
	errors: Array<{
		data: BulkRevenueAnalysisData;
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

const EXPECTED_HEADERS = [
	'ticker',
	'period',
	'price',
	'ps',
	'operatingMargin',
	'salesGrowthAdjustedRate',
];

interface BulkUploadRevenueAnalysisProps {
	onSuccess?: (result: BulkResult) => void;
}

export default function BulkUploadRevenueAnalysis({
	onSuccess,
}: BulkUploadRevenueAnalysisProps) {
	const [file, setFile] = useState<File | null>(null);
	const [parsedData, setParsedData] = useState<BulkRevenueAnalysisData[]>([]);
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

			if (row.price === undefined || isNaN(Number(row.price))) {
				errors.push({
					row: index + 1,
					field: 'price',
					value: row.price,
					error: 'Price is required and must be a number',
				});
			}

			if (row.ps === undefined || isNaN(Number(row.ps))) {
				errors.push({
					row: index + 1,
					field: 'ps',
					value: row.ps,
					error: 'P/S ratio is required and must be a number',
				});
			}

			if (
				row.operatingMargin === undefined ||
				isNaN(Number(row.operatingMargin))
			) {
				errors.push({
					row: index + 1,
					field: 'operatingMargin',
					value: row.operatingMargin,
					error: 'Operating Margin is required and must be a number',
				});
			}

			// Validate ranges
			if (row.price !== undefined && Number(row.price) < 0) {
				errors.push({
					row: index + 1,
					field: 'price',
					value: row.price,
					error: 'Price must be positive',
				});
			}

			if (row.ps !== undefined && Number(row.ps) < 0) {
				errors.push({
					row: index + 1,
					field: 'ps',
					value: row.ps,
					error: 'P/S ratio must be positive',
				});
			}

			if (
				row.operatingMargin !== undefined &&
				(Number(row.operatingMargin) < -1 || Number(row.operatingMargin) > 1)
			) {
				errors.push({
					row: index + 1,
					field: 'operatingMargin',
					value: row.operatingMargin,
					error: 'Operating Margin must be between -1 and 1',
				});
			}

			// Validate optional field
			if (
				row.salesGrowthAdjustedRate !== undefined &&
				row.salesGrowthAdjustedRate !== '' &&
				isNaN(Number(row.salesGrowthAdjustedRate))
			) {
				errors.push({
					row: index + 1,
					field: 'salesGrowthAdjustedRate',
					value: row.salesGrowthAdjustedRate,
					error: 'Sales Growth Adjusted Rate must be a number if provided',
				});
			}

			if (
				row.salesGrowthAdjustedRate !== undefined &&
				row.salesGrowthAdjustedRate !== '' &&
				(Number(row.salesGrowthAdjustedRate) < -1 ||
					Number(row.salesGrowthAdjustedRate) > 10)
			) {
				errors.push({
					row: index + 1,
					field: 'salesGrowthAdjustedRate',
					value: row.salesGrowthAdjustedRate,
					error: 'Sales Growth Adjusted Rate must be between -1 and 10',
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
							const processedData: BulkRevenueAnalysisData[] = data.map(
								(row) => ({
									ticker: String(row.ticker).toUpperCase(),
									period: Number(row.period),
									price: Number(row.price),
									ps: Number(row.ps),
									operatingMargin: Number(row.operatingMargin),
									salesGrowthAdjustedRate: row.salesGrowthAdjustedRate
										? Number(row.salesGrowthAdjustedRate)
										: undefined,
								}),
							);
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
							const processedData: BulkRevenueAnalysisData[] = jsonData.map(
								(row: any) => ({
									ticker: String(row.ticker || row.Ticker || '').toUpperCase(),
									period: Number(row.period || row.Period),
									price: Number(row.price || row.Price),
									ps: Number(row.ps || row.PS || row['P/S']),
									operatingMargin: Number(
										row.operatingMargin ||
											row.OperatingMargin ||
											row['Operating Margin'],
									),
									salesGrowthAdjustedRate:
										row.salesGrowthAdjustedRate ||
										row.SalesGrowthAdjustedRate ||
										row['Sales Growth Adjusted Rate']
											? Number(
													row.salesGrowthAdjustedRate ||
														row.SalesGrowthAdjustedRate ||
														row['Sales Growth Adjusted Rate'],
												)
											: undefined,
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
			const response = await fetch('/api/revenue-analysis/bulk', {
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
					{
						data: {} as BulkRevenueAnalysisData,
						error: 'Network error occurred',
					},
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
				period: 2024,
				price: 150.25,
				ps: 5.2,
				operatingMargin: 0.25,
				salesGrowthAdjustedRate: 0.15,
			},
			{
				ticker: 'GOOGL',
				period: 2024,
				price: 2800.5,
				ps: 4.8,
				operatingMargin: 0.22,
				salesGrowthAdjustedRate: '',
			},
		];

		const csv = Papa.unparse(template);
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = 'revenue_analysis_template.csv';
		link.click();
	};

	return (
		<Card elevation={2}>
			<CardContent>
				<Box sx={{ mb: 3 }}>
					<Typography variant="h6" gutterBottom>
						Bulk Upload Revenue Analysis
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Upload CSV or Excel files to create multiple revenue analyses at
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
								{parsedData.length} analyses.
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
								: `Upload ${parsedData.length} Analyses`}
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
										<TableRow key={`${row.ticker}-${row.period}-${index}`}>
											<TableCell>{row.ticker}</TableCell>
											<TableCell>{row.period}</TableCell>
											<TableCell>{row.price}</TableCell>
											<TableCell>{row.ps}</TableCell>
											<TableCell>{row.operatingMargin}</TableCell>
											<TableCell>
												{row.salesGrowthAdjustedRate || '-'}
											</TableCell>
										</TableRow>
									))}
									{parsedData.length > 20 && (
										<TableRow>
											<TableCell
												colSpan={6}
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
													key={`error-${error.data.ticker || 'unknown'}-${error.data.period || 0}-${index}`}
													sx={{ mb: 1 }}
												>
													<Typography variant="body2">
														<strong>{error.data.ticker}</strong> (Period:{' '}
														{error.data.period}): {error.error}
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
