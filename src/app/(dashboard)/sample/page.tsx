'use client';

import { useEffect, useState } from 'react';

interface Holding {
	ticker: string;
	current_shares: number;
}

export default function PortfolioPage() {
	const weekNumber = 1;
	const [holdings, setHoldings] = useState<Holding[]>([]);
	const [cashBalance, setCashBalance] = useState<number>(0);

	useEffect(() => {
		// 보유 종목 조회
		fetch(`/api/portfolio/${weekNumber}`)
			.then((res) => res.json())
			.then((data) => setHoldings(data));

		// 현금 잔고 조회
		fetch(`/api/portfolio/${weekNumber}/cash`)
			.then((res) => res.json())
			.then((data) => setCashBalance(data.cash_balance));
	}, []);

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">{weekNumber}주차 포트폴리오</h1>

			<div className="mb-6">
				<h2 className="text-lg font-semibold mb-2">현금 잔고</h2>
				<p className="text-xl">${cashBalance.toLocaleString()}</p>
			</div>

			<div>
				<h2 className="text-lg font-semibold mb-2">보유 종목</h2>
				<div className="space-y-2">
					{holdings.map((holding) => (
						<div
							key={holding.ticker}
							className="flex justify-between p-2 border rounded"
						>
							<span className="font-medium">{holding.ticker}</span>
							<span>{holding.current_shares}주</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
