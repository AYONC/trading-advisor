/**
 * UTC 시간을 한국 시간(KST)으로 변환하여 포맷팅합니다.
 * @param dateString - UTC 시간 문자열 또는 Date 객체
 * @returns 한국 시간으로 포맷팅된 문자열 (YYYY.MM.DD HH:mm:ss)
 */
export const formatDateTime = (dateString: string | Date): string => {
	const date =
		typeof dateString === 'string' ? new Date(dateString) : dateString;

	return date.toLocaleString('ko-KR', {
		timeZone: 'Asia/Seoul',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false,
	});
};

/**
 * UTC 시간을 한국 날짜로 변환하여 포맷팅합니다.
 * @param dateString - UTC 시간 문자열 또는 Date 객체
 * @returns 한국 시간 기준 날짜 (YYYY.MM.DD)
 */
export const formatDate = (dateString: string | Date): string => {
	const date =
		typeof dateString === 'string' ? new Date(dateString) : dateString;

	return date.toLocaleDateString('ko-KR', {
		timeZone: 'Asia/Seoul',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	});
};
