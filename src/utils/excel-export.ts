import * as XLSX from 'xlsx';
import type { ProcessedAnalysisData } from '@/app/(dashboard)/analysis/earning/earning-analysis-calculation';
import { formatDateTime } from '@/utils/date';

/**
 * Excel 내보내기 옵션
 */
export interface ExcelExportOptions {
	filename?: string;
	sheetName?: string;
	autoSizeColumns?: boolean;
	dateFormat?: string;
}

/**
 * 분석 데이터를 Excel 형태로 변환하는 함수
 */
export const transformAnalysisDataForExcel = (
	analyses: ProcessedAnalysisData[],
) => {
	return analyses.map((analysis) => ({
		Ticker: analysis.stock?.ticker || '',
		'Company Name': analysis.stock?.companyName || '',
		Period: analysis.period || 0,
		'Stock ID': analysis.stock?.id || 0,
		'EPS Revision Grade': analysis.epsRevisionGrade || '',
		Price: analysis.price,
		'P/E (FWD)': analysis.pe,
		ROA: analysis.roa,
		'EPS Growth Adj. Rate': analysis.epsGrowthAdjustedRate,
		'EPS Growth +0': analysis.eps_growth_0,
		'EPS Growth +1': analysis.eps_growth_1,
		'EPS Growth +2': analysis.eps_growth_2,
		'EPS Growth Avg': analysis.eps_growth_avg,
		'EPS Ratio': analysis.eps_ratio,
		'성장성 Valuation (PER)': analysis.growth_valuation,
		'성장성 Valuation Price': analysis.growth_valuation_price,
		'성장수익성 Valuation (PER)': analysis.growth_profitability_valuation,
		'성장수익성 Valuation Price': analysis.growth_profitability_valuation_price,
		'Upside Potential': analysis.upside_potential,
		Sector: analysis.stock?.sector?.name || '',
		Created: analysis.createdAt ? formatDateTime(analysis.createdAt) : '',
	}));
};

/**
 * 기본 파일명 생성 함수
 */
export const generateDefaultFilename = (prefix: string = 'export') => {
	const now = new Date();
	const year = now.getFullYear();
	const month = (now.getMonth() + 1).toString().padStart(2, '0');
	const day = now.getDate().toString().padStart(2, '0');
	const hours = now.getHours().toString().padStart(2, '0');
	const minutes = now.getMinutes().toString().padStart(2, '0');

	return `${prefix}-${year}-${month}-${day}-${hours}${minutes}.xlsx`;
};

/**
 * 컬럼 너비 자동 조정 함수
 */
export const calculateColumnWidths = (data: any[]) => {
	if (data.length === 0) return [];

	const firstRow = data[0];
	return Object.keys(firstRow).map((key) => ({
		wch: Math.max(key.length, 15), // 최소 15자 보장
	}));
};

/**
 * Excel 워크북 생성 및 다운로드 함수
 */
export const createAndDownloadExcel = (
	data: ProcessedAnalysisData[],
	options: ExcelExportOptions = {},
) => {
	const {
		filename = generateDefaultFilename('earning-analysis'),
		sheetName = 'Analysis Data',
		autoSizeColumns = true,
	} = options;

	try {
		// 데이터 검증
		if (!data || data.length === 0) {
			throw new Error('No data to export');
		}

		console.log(`Exporting ${data.length} rows to Excel...`);

		// 데이터 변환
		const excelData = transformAnalysisDataForExcel(data);

		// 워크북 및 워크시트 생성
		const workbook = XLSX.utils.book_new();
		const worksheet = XLSX.utils.json_to_sheet(excelData);

		// 컬럼 너비 자동 조정
		if (autoSizeColumns) {
			const columnWidths = calculateColumnWidths(excelData);
			worksheet['!cols'] = columnWidths;
		}

		// 워크시트를 워크북에 추가
		XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

		// 파일 다운로드
		XLSX.writeFile(workbook, filename);

		console.log(`Excel file downloaded: ${filename}`);

		return {
			success: true,
			filename,
			rowCount: data.length,
			message: `Successfully exported ${data.length} rows to ${filename}`,
		};
	} catch (error) {
		console.error('Excel export error:', error);

		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error occurred',
			message: 'Failed to export Excel file. Please try again.',
		};
	}
};

/**
 * 특정 분석 타입별 Excel 내보내기 함수들
 */
export const exportEarningAnalysis = (
	data: ProcessedAnalysisData[],
	options?: ExcelExportOptions,
) => {
	return createAndDownloadExcel(data, {
		filename: generateDefaultFilename('earning-analysis'),
		sheetName: 'Earning Analysis',
		...options,
	});
};

export const exportRevenueAnalysis = (
	data: ProcessedAnalysisData[],
	options?: ExcelExportOptions,
) => {
	return createAndDownloadExcel(data, {
		filename: generateDefaultFilename('revenue-analysis'),
		sheetName: 'Revenue Analysis',
		...options,
	});
};

export const exportEpsGrowthAnalysis = (
	data: ProcessedAnalysisData[],
	options?: ExcelExportOptions,
) => {
	return createAndDownloadExcel(data, {
		filename: generateDefaultFilename('eps-growth-analysis'),
		sheetName: 'EPS Growth Analysis',
		...options,
	});
};

/**
 * 사용자 정의 데이터 변환기를 받는 범용 Excel 내보내기 함수
 */
export const createCustomExcel = <T>(
	data: T[],
	transformer: (item: T) => Record<string, any>,
	options: ExcelExportOptions = {},
) => {
	try {
		if (!data || data.length === 0) {
			throw new Error('No data to export');
		}

		const transformedData = data.map(transformer);

		const {
			filename = generateDefaultFilename('custom-export'),
			sheetName = 'Data',
			autoSizeColumns = true,
		} = options;

		const workbook = XLSX.utils.book_new();
		const worksheet = XLSX.utils.json_to_sheet(transformedData);

		if (autoSizeColumns) {
			const columnWidths = calculateColumnWidths(transformedData);
			worksheet['!cols'] = columnWidths;
		}

		XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
		XLSX.writeFile(workbook, filename);

		return {
			success: true,
			filename,
			rowCount: data.length,
			message: `Successfully exported ${data.length} rows to ${filename}`,
		};
	} catch (error) {
		console.error('Custom Excel export error:', error);

		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error occurred',
			message: 'Failed to export Excel file. Please try again.',
		};
	}
};
