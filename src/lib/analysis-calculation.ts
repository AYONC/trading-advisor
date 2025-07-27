export function getAverageGrowth(values: number[]) {
	const average = values.reduce((acc, curr) => acc + curr, 0) / values.length;
	return average;
}

// 1. peg ratio
// =D2/(M2*100)
// =pe/(average_eps_growth*100)

// 2. 순이익 > 성장성 기준 per
// =if(L5,(L5*100*G5),(M5*100)*G5)
// if 평균성장률 조정:
//   평균성장률 조정값 * 100 * sector_peg_ratio
// else
//   average_eps_growth * 100 * sector_peg_ratio

// 3. 순이익 > 성장성 기준 적정주가
// =if(C5*(O5/D5) < 0, C5 * 0.9, C5*(O5/D5))
// if 주가 * (성장성 기준 per/pe) < 0 ? 주가 * 0.9 : 주가 * (성장성 기준 per/pe)

// 4. 순이익 > 성장성,수익성 기준 per
// =(
//   IF(L8, (L8*100*G8), (M8*100)*G8)
// ) *
// IFERROR(
//   MIN(1.3, MAX(0.7,
//     IF(E8 > H8,
//        IF(E8 - H8 < 0.1,
//           1,
//           1 + 1 * LN(1 + (E8 - H8))
//        ),
//        1 - 1 * LN(1 + (H8 - E8))
//     )
//   )),
// 1)
// E: roa, H: sector roa, L: 평균성장률 조정, M: 평균성장률
// const x = growth adjusted eps ? growth adjusted eps * 100 * sector_peg_ratio : average_eps_growth * 100 * sector_peg_ratio
// const y = min(1.3, max(0.7, roa > sector_roa ? 1 + ln(1 + (roa - sector_roa)) : 1 - ln(1 + (sector_roa - roa))))
// const result = x * y

// 5. 순이익 > 성장성,수익성 기준 적정주가
// =if(C3*(Q3/D3) < 0, C3 * 0.9, C3*(Q3/D3))
// C: 주가, D: pe, E: roa, H: sector roa, L: 평균성장률 조정, M: 평균성장률, G: sector peg ratio, Q: 성장성, 수익성 PER, T: 성장성, 수익성 기준 주가
// if 주가 * (성장성 기준 per/pe) < 0 ? 주가 * 0.9 : 주가 * (성장성, 수익성 기준 per/pe)

// 6. 상승여력
// =T6/C6-1
// C: 주가, D: pe, E: roa, H: sector roa, L: 평균성장률 조정, M: 평균성장률, G: sector peg ratio, Q: 성장성, 수익성 PER, T: 성장성, 수익성 기준 주가
// 성장성, 수익성 기준 주가 / 주가 - 1

// C: 주가, D: ps, E: operating_margin, F: sector_psg_ratio, G: sector_operating_margin,
// K: 평균성장률 조정, L: average_sales_growth, M: psg_ratio, N: 40% Rule, O: 성장성 적정 value(psr),
// P: valuation 할인율, Q: 성장성, 수익성 적정 value(psr), T: 성장성 적정주가, U: 성장성, 수익성 적정주가, V: 상승여력

// 7. Average Sales growth 3년 매출 성장률 평균
// 8. PSG Ratio
// =D2/(L2*100)
// D: ps, L: average_sales_growth
// ps / (average_sales_growth * 100)

// 9. 40% Rule
// =H2+E2
// H: 올해 성장률, E: operating_margin
// 올해 성장률 + operating_margin

// 10. 적정 Value 성장성만 본 경우 (PSR)
// C: 주가, D: ps, E: operating_margin, F: sector_psg_ratio, G: sector_operating_margin,
// K: 평균성장률 조정, L: average_sales_growth, M: psg_ratio, N: 40% Rule, O: 성장성 적정 value(psr),
// P: valuation 할인율, Q: 성장성, 수익성 적정 value(psr), T: 성장성 적정주가, U: 성장성, 수익성 적정주가, V: 상승여력
// =if(K5,(K5*100)*F5,if(L5<0,D5+D5*L5,(L5*100)*F5))
// if 평균성장률 조정
// ? 평균성장률 조정 * 100 * sector_psg_ratio
// : if average_sales_growth < 0 ? ps+ps*average_sales_growth : average_sales_growth * 100 * sector_psg_ratio

// 11. Valuation 할인률
// C: 주가, D: ps, E: operating_margin, F: sector_psg_ratio, G: sector_operating_margin,
// K: 평균성장률 조정, L: average_sales_growth, M: psg_ratio, N: 40% Rule, O: 성장성 적정 value(psr),
// P: valuation 할인율, Q: 성장성, 수익성 적정 value(psr), T: 성장성 적정주가, U: 성장성, 수익성 적정주가, V: 상승여력
// =IF(E5<G5,IF(E5<0,(E5+G5)/2,(E5-G5)/2),(E5-G5)/2)
// if operating_margin < sector_operating_margin
// ? if operating_margin < 0 ? (operating_margin + sector_operating_margin) / 2 : (operating_margin - sector_operating_margin) / 2
// : (operating_margin - sector_operating_margin) / 2

// 12. 적정 Value 성장성+수익성 (PSR)
// C: 주가, D: ps, E: operating_margin, F: sector_psg_ratio, G: sector_operating_margin,
// K: 평균성장률 조정, L: average_sales_growth, M: psg_ratio, N: 40% Rule, O: 성장성 적정 value(psr),
// P: valuation 할인율, Q: 성장성, 수익성 적정 value(psr), T: 성장성 적정주가, U: 성장성, 수익성 적정주가, V: 상승여력
// =O2+(O2*P2)
// O: 성장성 적정 value(psr), P: valuation 할인율
// 성장성 적정 value(psr) + 성장성 적정 value(psr) * valuation 할인율

// 13. 52주 최고주가
// 14. 고점대비 하락율
// 15. 성장성반영 적정주가
// =C2*O2/D2
// 주가 * 성장성 적정 value(psr) / ps

// 16. 성장성+수익성반영 적정주가
// C: 주가, D: ps, E: operating_margin, F: sector_psg_ratio, G: sector_operating_margin,
// K: 평균성장률 조정, L: average_sales_growth, M: psg_ratio, N: 40% Rule, O: 성장성 적정 value(psr),
// P: valuation 할인율, Q: 성장성, 수익성 적정 value(psr), T: 성장성 적정주가, U: 성장성, 수익성 적정주가, V: 상승여력
// =C2*Q2/D2
// 주가 * 성장성, 수익성 적정 value(psr) / ps

// 17. 상승여력
// =U2/C2-1
// 성장성, 수익성 적정주가 / 주가 - 1
