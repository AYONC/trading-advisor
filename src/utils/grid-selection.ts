import type { GridRowSelectionModel } from '@mui/x-data-grid';
import { useCallback, useMemo, useState } from 'react';

/**
 * GridRowSelectionModel에서 선택된 row ID들을 number 배열로 추출하는 함수
 * @param rowSelectionModel - MUI DataGrid의 selection model
 * @param allRowIds - 전체 row ID 목록 (exclude 타입일 때 필요)
 */
export const extractSelectedRowIds = (
	rowSelectionModel: GridRowSelectionModel | null,
	allRowIds: number[] = [],
): number[] => {
	console.log('Current rowSelectionModel:', rowSelectionModel);
	console.log('All row IDs:', allRowIds);

	if (!rowSelectionModel?.ids) {
		return [];
	}

	let selectedIds: any[] = [];

	// Handle both Set and Array types
	if (Array.isArray(rowSelectionModel.ids)) {
		selectedIds = rowSelectionModel.ids;
	} else if (rowSelectionModel.ids instanceof Set) {
		selectedIds = Array.from(rowSelectionModel.ids);
	} else {
		return [];
	}

	// Convert to numbers, filter out invalid values
	const numericIds = selectedIds
		.map((id) => {
			// Handle different ID types (string, number)
			if (typeof id === 'number') return id;
			if (typeof id === 'string') {
				const parsed = parseInt(id, 10);
				return isNaN(parsed) ? null : parsed;
			}
			return null;
		})
		.filter((id): id is number => id !== null);

	// Handle include vs exclude types
	if (rowSelectionModel.type === 'exclude') {
		// If type is exclude, return all IDs except the ones in the model
		const excludedSet = new Set(numericIds);
		const result = allRowIds.filter((id) => !excludedSet.has(id));
		console.log('Parsed selected IDs (exclude):', result);
		return result;
	} else {
		// If type is include (default), return the IDs directly
		console.log('Parsed selected IDs (include):', numericIds);
		return numericIds;
	}
};

/**
 * 기본 GridRowSelectionModel 객체를 생성하는 함수
 */
export const createDefaultSelectionModel = (): GridRowSelectionModel => ({
	type: 'include',
	ids: new Set(),
});

/**
 * 배열을 GridRowSelectionModel로 변환하는 함수
 */
export const arrayToSelectionModel = (ids: any[]): GridRowSelectionModel => ({
	type: 'include',
	ids: new Set(ids),
});

/**
 * GridRowSelectionModel이 비어있는지 확인하는 함수
 * exclude 타입의 경우 전체 목록과 비교하여 판단
 */
export const isSelectionEmpty = (
	rowSelectionModel: GridRowSelectionModel | null,
	allRowIds: number[] = [],
): boolean => {
	if (!rowSelectionModel?.ids) return true;

	if (rowSelectionModel.type === 'exclude') {
		// exclude 타입: 제외할 ID가 전체와 같으면 선택이 비어있음
		const ids = rowSelectionModel.ids as any;
		let excludedCount = 0;
		if (ids instanceof Set) {
			excludedCount = ids.size;
		} else if (Array.isArray(ids)) {
			excludedCount = ids.length;
		}
		return excludedCount >= allRowIds.length;
	}

	// include 타입: ids가 비어있으면 선택이 비어있음
	const ids = rowSelectionModel.ids as any;
	if (ids instanceof Set) {
		return ids.size === 0;
	}

	if (Array.isArray(ids)) {
		return ids.length === 0;
	}

	return true;
};

/**
 * 선택된 행의 개수를 반환하는 함수
 * exclude 타입의 경우 전체에서 제외된 개수를 뺀 값
 */
export const getSelectionCount = (
	rowSelectionModel: GridRowSelectionModel | null,
	allRowIds: number[] = [],
): number => {
	if (!rowSelectionModel?.ids) return 0;

	if (rowSelectionModel.type === 'exclude') {
		// exclude 타입: 전체 개수에서 제외된 개수를 뺌
		const ids = rowSelectionModel.ids as any;
		let excludedCount = 0;
		if (ids instanceof Set) {
			excludedCount = ids.size;
		} else if (Array.isArray(ids)) {
			excludedCount = ids.length;
		}
		return Math.max(0, allRowIds.length - excludedCount);
	}

	// include 타입: ids 개수를 직접 반환
	const ids = rowSelectionModel.ids as any;
	if (ids instanceof Set) {
		return ids.size;
	}

	if (Array.isArray(ids)) {
		return ids.length;
	}

	return 0;
};

/**
 * 선택 모델을 로그하는 디버깅 함수
 */
export const logSelectionChange = (
	newSelection: GridRowSelectionModel,
	context = '',
) => {
	console.log(`=== SELECTION CHANGE ${context} ===`);
	console.log('Raw newSelection:', newSelection);
	console.log('Selection type:', newSelection?.type);
	console.log('Selection ids type:', typeof newSelection?.ids);
	console.log('Selection ids:', newSelection?.ids);

	const ids = newSelection?.ids as any;
	let sizeOrLength = 0;
	if (ids instanceof Set) {
		sizeOrLength = ids.size;
	} else if (Array.isArray(ids)) {
		sizeOrLength = ids.length;
	}
	console.log('Selection ids size/length:', sizeOrLength);
};

/**
 * DataGrid에서 선택 상태를 관리하기 위한 커스텀 훅
 * @param allRowIds - 전체 row ID 목록 (exclude 타입 처리에 필요)
 */
export const useGridSelection = (allRowIds: number[] = []) => {
	const [rowSelectionModel, setRowSelectionModel] =
		useState<GridRowSelectionModel>(createDefaultSelectionModel());

	const selectedRowIds = useMemo(() => {
		return extractSelectedRowIds(rowSelectionModel, allRowIds);
	}, [rowSelectionModel, allRowIds]);

	const selectedRowCount = useMemo(() => {
		return getSelectionCount(rowSelectionModel, allRowIds);
	}, [rowSelectionModel, allRowIds]);

	const handleSelectionChange = useCallback(
		(newSelection: GridRowSelectionModel) => {
			logSelectionChange(newSelection);
			setRowSelectionModel(newSelection);
		},
		[],
	);

	const clearSelection = useCallback(() => {
		setRowSelectionModel(createDefaultSelectionModel());
	}, []);

	const selectAll = useCallback(() => {
		// Select all using exclude type with empty set
		setRowSelectionModel({
			type: 'exclude',
			ids: new Set(),
		});
	}, []);

	const isEmptySelection = useMemo(() => {
		return isSelectionEmpty(rowSelectionModel, allRowIds);
	}, [rowSelectionModel, allRowIds]);

	const isAllSelected = useMemo(() => {
		if (rowSelectionModel?.type !== 'exclude') return false;

		const ids = rowSelectionModel.ids as any;
		if (ids instanceof Set) {
			return ids.size === 0;
		} else if (Array.isArray(ids)) {
			return ids.length === 0;
		}
		return false;
	}, [rowSelectionModel]);

	return {
		rowSelectionModel,
		selectedRowIds,
		selectedRowCount,
		handleSelectionChange,
		clearSelection,
		selectAll,
		isEmpty: isEmptySelection,
		isAllSelected,
	};
};
