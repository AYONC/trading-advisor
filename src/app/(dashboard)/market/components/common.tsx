import { TrendingDown, TrendingUp } from '@mui/icons-material';

export const formatPrice = (price?: number) => {
	if (price === undefined) return 'N/A';
	return `$${price.toFixed(2)}`;
};

export const formatChange = (change?: number, changePercent?: number) => {
	if (change === undefined || changePercent === undefined) return 'N/A';
	const sign = change >= 0 ? '+' : '';
	return `${sign}${change.toFixed(2)} (${sign}${changePercent.toFixed(2)}%)`;
};

export const getChangeColor = (change?: number) => {
	if (change === undefined) return 'text.secondary';
	return change >= 0 ? 'success.main' : 'error.main';
};

export const getChangeIcon = (change?: number) => {
	if (change === undefined) return null;
	return change >= 0 ? (
		<TrendingUp fontSize="small" />
	) : (
		<TrendingDown fontSize="small" />
	);
};

export const formatVolume = (volume?: number) => {
	if (volume === undefined) return 'N/A';
	return volume.toLocaleString();
};
