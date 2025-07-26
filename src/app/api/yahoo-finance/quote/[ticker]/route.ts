import { type NextRequest, NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(
	request: NextRequest,
	{ params }: { params: { ticker: string } },
) {
	try {
		const { ticker } = params;

		if (!ticker) {
			return NextResponse.json(
				{ error: 'Ticker is required' },
				{ status: 400 },
			);
		}

		// Get current quote from Yahoo Finance
		const quote = await yahooFinance.quote(ticker.toUpperCase());

		const quoteData = {
			ticker: ticker.toUpperCase(),
			currentPrice: quote.regularMarketPrice,
			priceChange: quote.regularMarketChange,
			priceChangePercent: quote.regularMarketChangePercent,
			volume: quote.regularMarketVolume,
			marketCap: quote.marketCap,
			previousClose: quote.regularMarketPreviousClose,
		};

		return NextResponse.json(quoteData);
	} catch (error) {
		console.error(`Error fetching quote for ${params.ticker}:`, error);
		return NextResponse.json(
			{ error: 'Failed to fetch quote data' },
			{ status: 500 },
		);
	}
}
