import * as XLSX from 'xlsx';

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
