import { type NextRequest, NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(
	request: NextRequest,
	{ params }: { params: { ticker: string } },
) {
	try {
		const { ticker } = params;
		const { searchParams } = new URL(request.url);

		// Get days parameter (default to 7 days)
		const days = parseInt(searchParams.get('days') || '7');

		if (!ticker) {
			return NextResponse.json(
				{ error: 'Ticker is required' },
				{ status: 400 },
			);
		}

		// Calculate date range
		const endDate = new Date();
		const startDate = new Date();
		startDate.setDate(endDate.getDate() - days);

		// Get historical data from Yahoo Finance
		const historical = await yahooFinance.historical(ticker.toUpperCase(), {
			period1: startDate,
			period2: endDate,
			interval: '1d',
		});

		const historicalData = {
			ticker: ticker.toUpperCase(),
			days,
			data: historical.map((h) => ({
				date: h.date.toISOString().split('T')[0],
				open: h.open,
				high: h.high,
				low: h.low,
				close: h.close,
				volume: h.volume,
			})),
		};

		return NextResponse.json(historicalData);
	} catch (error) {
		console.error(
			`Error fetching historical data for ${params.ticker}:`,
			error,
		);
		return NextResponse.json(
			{ error: 'Failed to fetch historical data' },
			{ status: 500 },
		);
	}
}
