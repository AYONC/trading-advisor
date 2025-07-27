# Trading Advisor

**Trading Advisor**는 주식 시장 데이터를 분석하고 투자 의사결정을 지원하는 웹 애플리케이션입니다. 다양한 재무 지표와 분석 도구를 제공하여 효율적인 주식 투자를 도와줍니다.

## 🚀 주요 기능

### 📊 분석 도구
- **수익 분석 (Earning Analysis)**: P/E 비율, ROA, EPS 수정 등급 분석
- **EPS 성장 분석**: 주당순이익 성장률 추적 및 예측
- **매출 분석 (Revenue Analysis)**: 기업 매출 데이터 분석
- **매출 성장 분석 (Sales Growth)**: 매출 성장률 트렌드 분석

### 🏢 데이터 관리
- **주식 관리**: 티커, 회사명, 섹터별 주식 정보 관리
- **섹터 관리**: 산업별 분류 및 섹터 비율 분석
- **벌크 업로드**: CSV/Excel 파일을 통한 대량 데이터 등록

### 📈 마켓 대시보드
- **실시간 주식 데이터**: Yahoo Finance API 연동
- **차트 시각화**: 주가 추세 및 거래량 차트
- **포트폴리오 관리**: 주간별 포트폴리오 현금 관리

### 🎯 사용자 인터페이스
- **반응형 디자인**: 다크/라이트 모드 지원
- **데이터 그리드**: 정렬, 필터링, 페이지네이션 기능
- **검색 기능**: 다양한 조건으로 데이터 검색
- **외부 링크 연동**: Yahoo Finance로 바로 이동

## 🛠 기술 스택

### Frontend
- **Next.js 15.4.3**: React 기반 풀스택 프레임워크
- **React 19**: 사용자 인터페이스 라이브러리
- **Material-UI (MUI)**: UI 컴포넌트 라이브러리
- **TailwindCSS**: 유틸리티 기반 CSS 프레임워크
- **TypeScript**: 정적 타입 지원

### Backend
- **Next.js API Routes**: 서버리스 API 엔드포인트
- **TypeORM**: ORM (Object-Relational Mapping)
- **MySQL**: 관계형 데이터베이스

### 외부 서비스
- **Yahoo Finance API**: 실시간 주식 데이터
- **Recharts**: 차트 및 그래프 라이브러리

### 개발 도구
- **Biome**: 코드 포매팅 및 린팅
- **ts-node**: TypeScript 실행 환경

## 📦 설치 및 실행

### 사전 요구사항
- Node.js 18+ 
- MySQL 8.0+
- npm 또는 yarn

### 1. 저장소 클론
```bash
git clone <repository-url>
cd trading-advisor
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
`.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```bash
# 데이터베이스 설정
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=trading_advisor

# 환경 설정
ENVIRONMENT=local
NODE_ENV=development
```

### 4. 데이터베이스 마이그레이션
```bash
# 마이그레이션 실행
npm run migration:run
```

### 5. 개발 서버 실행
```bash
npm run dev
```

애플리케이션이 `http://localhost:3000`에서 실행됩니다.

## 📋 사용 가능한 스크립트

```bash
# 개발 서버 실행 (Turbopack 사용)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# 코드 린팅 및 포매팅
npm run lint

# 새 마이그레이션 생성
npm run migration:generate

# 마이그레이션 실행
npm run migration:run

# 마이그레이션 롤백
npm run migration:revert
```

## 🗂 프로젝트 구조

```
trading-advisor/
├── src/
│   ├── app/                    # Next.js 13+ App Router
│   │   ├── (dashboard)/        # 대시보드 페이지들
│   │   │   ├── analysis/       # 분석 도구들
│   │   │   ├── basic-data/     # 기본 데이터 관리
│   │   │   └── market/         # 마켓 대시보드
│   │   └── api/                # API 라우트들
│   ├── components/             # 재사용 가능한 UI 컴포넌트
│   ├── entities/               # TypeORM 엔티티 정의
│   ├── lib/                    # 유틸리티 라이브러리
│   ├── migrations/             # 데이터베이스 마이그레이션
│   └── theme/                  # MUI 테마 설정
├── public/                     # 정적 파일들
└── package.json
```

## 🔌 API 엔드포인트

### 주식 데이터
- `GET /api/stocks` - 모든 주식 목록 조회
- `GET /api/market/stocks` - 마켓 주식 데이터 조회

### 섹터 관리
- `GET /api/sectors` - 섹터 목록 조회
- `GET /api/sectors/[id]` - 특정 섹터 정보 조회

### 분석 데이터
- `GET /api/earning-analysis` - 수익 분석 데이터 조회
- `POST /api/earning-analysis/bulk` - 벌크 업로드
- `GET /api/eps-growth` - EPS 성장 데이터 조회
- `GET /api/revenue-analysis` - 매출 분석 데이터 조회
- `GET /api/sales-growth` - 매출 성장 데이터 조회

### 외부 API 연동
- `GET /api/yahoo-finance/quote/[ticker]` - 주식 시세 조회
- `GET /api/yahoo-finance/historical/[ticker]` - 주식 히스토리 조회
- `POST /api/yahoo-finance/batch` - 배치 데이터 조회

### 포트폴리오
- `GET /api/portfolio/[week]` - 주간 포트폴리오 조회
- `GET /api/portfolio/[week]/cash` - 포트폴리오 현금 정보

## 📊 데이터 모델

### 주요 엔티티
- **Stock**: 주식 기본 정보 (티커, 회사명, 섹터)
- **Sector**: 섹터 정보 및 비율
- **EarningStockAnalysis**: 수익 분석 데이터
- **EpsGrowth**: EPS 성장 데이터  
- **RevenueStockAnalysis**: 매출 분석 데이터
- **SalesGrowth**: 매출 성장 데이터

### 관계 구조
- Stock ↔ Sector (다대일)
- Stock ↔ Analysis Tables (일대다)

## 🤝 기여하기

1. 프로젝트를 포크합니다
2. 기능 브랜치를 생성합니다 (`git checkout -b feature/new-feature`)
3. 변경사항을 커밋합니다 (`git commit -am 'Add new feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/new-feature`)
5. Pull Request를 생성합니다

## 📄 라이센스

이 프로젝트는 비공개 프로젝트입니다.

## 🙋‍♂️ 문의 및 지원

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 생성해 주세요.

---

⭐ **Trading Advisor**로 더 스마트한 투자 결정을 내려보세요!
