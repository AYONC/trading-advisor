import { type NextRequest, NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function POST(request: NextRequest) {
	try {
		const { tickers, includHistorical = true, days = 7 } = await request.json();

		if (!tickers || !Array.isArray(tickers) || tickers.length === 0) {
			return NextResponse.json(
				{ error: 'Tickers array is required' },
				{ status: 400 },
			);
		}

		const results = await Promise.allSettled(
			tickers.map(async (ticker: string) => {
				try {
					// Get current quote
					const quote = await yahooFinance.quote(ticker.toUpperCase());

					let historical = null;
					if (includHistorical) {
						// Get historical data
						const endDate = new Date();
						const startDate = new Date();
						startDate.setDate(endDate.getDate() - days);

						const hist = await yahooFinance.historical(ticker.toUpperCase(), {
							period1: startDate,
							period2: endDate,
							interval: '1d',
						});

						historical = hist.map((h) => ({
							date: h.date.toISOString().split('T')[0],
							close: h.close,
							volume: h.volume,
						}));
					}

					return {
						ticker: ticker.toUpperCase(),
						success: true,
						data: {
							currentPrice: quote.regularMarketPrice,
							priceChange: quote.regularMarketChange,
							priceChangePercent: quote.regularMarketChangePercent,
							volume: quote.regularMarketVolume,
							historical,
						},
					};
				} catch (error) {
					console.error(`Error fetching data for ${ticker}:`, error);
					return {
						ticker: ticker.toUpperCase(),
						success: false,
						error: 'Failed to fetch data',
					};
				}
			}),
		);

		const response = results.map((result) =>
			result.status === 'fulfilled'
				? result.value
				: {
						ticker: 'UNKNOWN',
						success: false,
						error: 'Request failed',
					},
		);

		return NextResponse.json(response);
	} catch (error) {
		console.error('Error in batch Yahoo Finance request:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}
