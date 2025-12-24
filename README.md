# 네이버 API MCP 서버

네이버 쇼핑인사이트 API와 검색 API를 통합하여 제공하는 MCP(Model Context Protocol) 서버입니다.

## 기능

### 쇼핑인사이트 API (DataLab)

#### 카테고리별 트렌드 조회
- `get-category-trends`: 분야별 트렌드 조회 (최대 3개 카테고리)
- `get-category-by-device`: 기기별 트렌드 조회
- `get-category-by-gender`: 성별 트렌드 조회
- `get-category-by-age`: 연령별 트렌드 조회

#### 키워드별 트렌드 조회
- `get-keyword-trends`: 키워드별 트렌드 조회 (최대 5개 키워드)
- `get-keyword-by-device`: 키워드 기기별 트렌드 조회
- `get-keyword-by-gender`: 키워드 성별 트렌드 조회
- `get-keyword-by-age`: 키워드 연령별 트렌드 조회

### 검색 API

- `search-blog`: 블로그 검색
- `search-kin`: 지식iN 검색
- `search-shopping`: 쇼핑 검색
- `search-encyclopedia`: 백과사전 검색

## 설치

### 소스코드에서 설치

```bash
# 저장소 클론
git clone https://github.com/dataartai/naver-api-mcp.git
cd naver-api-mcp

# 의존성 설치
npm install

# 빌드
npm run build
```

## 설정

1. 네이버 개발자 센터(https://developers.naver.com)에서 애플리케이션을 등록하고 클라이언트 아이디와 시크릿을 발급받으세요.
   - **쇼핑인사이트 API**: DataLab > 쇼핑인사이트 API 사용 신청
   - **검색 API**: 검색 API 사용 신청

2. 환경 변수 설정:

**방법 1: `.env` 파일 사용 (로컬 개발)**
```env
NAVER_CLIENT_ID=your-client-id
NAVER_CLIENT_SECRET=your-client-secret
```

**방법 2: MCP 설정 파일에서 직접 설정**

```json
{
  "mcpServers": {
    "naver-api": {
      "command": "node",
      "args": [
        "path/to/naver-api-mcp/dist/index.js"
      ],
      "env": {
        "NAVER_CLIENT_ID": "YOUR-CLIENT-ID",
        "NAVER_CLIENT_SECRET": "YOUR-CLIENT-SECRET"
      }
    }
  }
}
```

## 사용 방법

### 직접 실행

```bash
npm start
```

### Claude Desktop 설정

Claude Desktop에서 사용하려면 다음 설정 파일에 추가하세요:

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "naver-api": {
      "command": "node",
      "args": [
        "D:\\OneDrive\\Cursorhome\\naver-api-mcp\\dist\\index.js"
      ],
      "cwd": "D:\\OneDrive\\Cursorhome\\naver-api-mcp",
      "env": {
        "NAVER_CLIENT_ID": "YOUR-CLIENT-ID",
        "NAVER_CLIENT_SECRET": "YOUR-CLIENT-SECRET"
      }
    }
  }
}
```

> **참고**: 경로는 실제 프로젝트 경로로 변경하세요.

## MCP 도구 사용 가이드

### 쇼핑인사이트 API 도구

#### 카테고리별 트렌드 조회

**`get-category-trends`**: 여러 카테고리의 트렌드를 비교 조회
- `startDate`: 시작 날짜 (YYYY-MM-DD)
- `endDate`: 종료 날짜 (YYYY-MM-DD)
- `timeUnit`: 시간 단위 (`date`, `week`, `month`)
- `categories`: 카테고리 배열 (최대 3개)
- `device`: 기기 필터 (`pc`, `mobile`, `all`) - 선택
- `gender`: 성별 필터 (`m`, `f`, `a`) - 선택
- `ages`: 연령대 배열 (`10`, `20`, `30`, `40`, `50`, `60`) - 선택

**`get-category-by-device`**: 특정 카테고리의 기기별 트렌드
- `category`: 카테고리 ID (예: `50000000`)

**`get-category-by-gender`**: 특정 카테고리의 성별 트렌드
- `category`: 카테고리 ID

**`get-category-by-age`**: 특정 카테고리의 연령별 트렌드
- `category`: 카테고리 ID

#### 키워드별 트렌드 조회

**`get-keyword-trends`**: 여러 키워드의 트렌드를 비교 조회
- `category`: 카테고리 ID
- `keywords`: 키워드 배열 (최대 5개)

**`get-keyword-by-device`**: 특정 키워드의 기기별 트렌드
- `category`: 카테고리 ID
- `keyword`: 검색 키워드

**`get-keyword-by-gender`**: 특정 키워드의 성별 트렌드
- `category`: 카테고리 ID
- `keyword`: 검색 키워드

**`get-keyword-by-age`**: 특정 키워드의 연령별 트렌드
- `category`: 카테고리 ID
- `keyword`: 검색 키워드

### 검색 API 도구

#### 블로그 검색 (`search-blog`)
- `query`: 검색어 (필수)
- `display`: 한 번에 표시할 결과 개수 (1-100, 기본값: 10)
- `start`: 검색 시작 위치 (1-1000, 기본값: 1)
- `sort`: 정렬 방법 (`sim`: 정확도순, `date`: 날짜순)

#### 지식iN 검색 (`search-kin`)
- `query`: 검색어 (필수)
- `display`: 한 번에 표시할 결과 개수 (1-100, 기본값: 10)
- `start`: 검색 시작 위치 (1-1000, 기본값: 1)
- `sort`: 정렬 방법 (`sim`: 정확도순, `date`: 날짜순, `point`: 평점순)

#### 쇼핑 검색 (`search-shopping`)
- `query`: 검색어 (필수)
- `display`: 한 번에 표시할 결과 개수 (1-100, 기본값: 10)
- `start`: 검색 시작 위치 (1-1000, 기본값: 1)
- `sort`: 정렬 방법 (`sim`: 정확도순, `date`: 날짜순, `asc`: 가격 오름차순, `dsc`: 가격 내림차순)
- `filter`: 필터 (`naverpay`: 네이버페이 연동 상품만) - 선택
- `exclude`: 제외할 상품 유형 (`used`: 중고, `rental`: 렌탈, `cbshop`: 해외직구) - 선택

#### 백과사전 검색 (`search-encyclopedia`)
- `query`: 검색어 (필수)
- `display`: 한 번에 표시할 결과 개수 (1-100, 기본값: 10)
- `start`: 검색 시작 위치 (1-1000, 기본값: 1)

## 주요 카테고리 ID

- 패션의류: `50000000`
- 화장품/미용: `50000002`
- 디지털/가전: `50000003`
- 식품: `50000008`

## API 제한사항

### 쇼핑인사이트 API (DataLab)
- **카테고리 배열**: 최대 3개까지만 설정 가능 (`get-category-trends`)
- **키워드 배열**: 최대 5개까지만 설정 가능 (`get-keyword-trends`)
- **일일 호출 한도**: 하루 1,000회

### 검색 API
- **일일 호출 한도**: 하루 25,000회
- **display**: 최대 100개
- **start**: 최대 1,000

## 프로젝트 구조

```
naver-api-mcp/
├── src/
│   ├── index.ts              # 서버 진입점
│   ├── server.ts             # MCP 서버 정의
│   └── clients/
│       ├── shoppingInsightClient.ts  # 쇼핑인사이트 API 클라이언트
│       └── searchClient.ts            # 검색 API 클라이언트
├── dist/                     # 빌드 결과물
├── package.json
└── README.md
```

## 라이선스

ISC

## 참고 자료

- [네이버 데이터랩 API 문서 > 쇼핑인사이트](https://developers.naver.com/docs/serviceapi/datalab/shopping/shopping.md)
- [네이버 검색 API 문서 > 블로그](https://developers.naver.com/docs/serviceapi/search/blog/blog.md)
- [네이버 검색 API 문서 > 지식iN](https://developers.naver.com/docs/serviceapi/search/kin/kin.md)
- [네이버 검색 API 문서 > 쇼핑](https://developers.naver.com/docs/serviceapi/search/shopping/shopping.md)
- [네이버 검색 API 문서 > 백과사전](https://developers.naver.com/docs/serviceapi/search/encyclopedia/encyclopedia.md)
- [Model Context Protocol](https://modelcontextprotocol.io)
