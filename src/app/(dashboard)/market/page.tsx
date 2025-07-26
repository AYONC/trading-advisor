import { Box, CircularProgress, Container } from '@mui/material';
import { Suspense } from 'react';
import MarketDashboard from './components/MarketDashboard';

interface Stock {
	id: number;
	ticker: string;
	companyName: string;
	sector: {
		id: number;
		name: string;
	};
}

async function getStocks(): Promise<Stock[]> {
	try {
		// Use the full URL for server-side fetching
		const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
		const response = await fetch(`${baseUrl}/api/market/stocks`, {
			cache: 'no-store', // Ensure fresh data
		});

		if (response.ok) {
			return await response.json();
		} else {
			console.error('Failed to fetch stocks:', response.statusText);
			return [];
		}
	} catch (error) {
		console.error('Error fetching stocks:', error);
		return [];
	}
}

function LoadingFallback() {
	return (
		<Container maxWidth="xl">
			<Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
				<CircularProgress size={60} />
			</Box>
		</Container>
	);
}

export default async function MarketPage() {
	const stocks = await getStocks();

	return (
		<Suspense fallback={<LoadingFallback />}>
			<MarketDashboard initialStocks={stocks} />
		</Suspense>
	);
}
