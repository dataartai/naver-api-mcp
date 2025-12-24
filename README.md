# 네이버 쇼핑인사이트 MCP 서버

네이버 쇼핑인사이트 API를 사용하여 쇼핑 트렌드 데이터를 MCP(Model Context Protocol) 형식으로 제공하는 서버입니다.

## 기능

### 카테고리별 트렌드 조회
- 쇼핑인사이트 분야별 트렌드 조회
- 쇼핑인사이트 분야 내 기기별 트렌드 조회
- 쇼핑인사이트 분야 내 성별 트렌드 조회
- 쇼핑인사이트 분야 내 연령별 트렌드 조회

### 키워드별 트렌드 조회
- 쇼핑인사이트 키워드별 트렌드 조회
- 쇼핑인사이트 키워드 기기별 트렌드 조회
- 쇼핑인사이트 키워드 성별 트렌드 조회
- 쇼핑인사이트 키워드 연령별 트렌드 조회


## 설치

### NPM 패키지로 설치

```bash
# npm을 통한 설치
npm install naver-shopping-insight-mcp
```

### 소스코드에서 설치

```bash
# 저장소 클론
git clone https://github.com/dataartai/naver-shopping-insight-mcp
cd naver-shopping-insight-mcp

# 의존성 설치
npm install

# 빌드
npm run build
```

## 설정

1. 네이버 개발자 센터(https://developers.naver.com)에서 애플리케이션을 등록하고 클라이언트 아이디와 시크릿을 발급받으세요.
2. `MCP.json` 파일에 발급받은 클라이언트 아이디와 시크릿을 입력하세요:

```json
{
  "mcpServers": {
    "naver-shopping-insight": {
      "command": "node",
      "args": [
        "dist/index.js"
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

### npm 패키지로 설치한 경우

npm 패키지로 설치한 경우 MCP 설정 파일에 다음과 같이 설정할 수 있습니다:

```json
{
  "mcpServers": {
    "naver-shopping-insight": {
      "command": "npx",
      "args": [
        "naver-shopping-insight-mcp"
      ],
      "env": {
        "NAVER_CLIENT_ID": "YOUR-CLIENT-ID",
        "NAVER_CLIENT_SECRET": "YOUR-CLIENT-SECRET"
      }
    }
  }
}
```

### MCP 클라이언트에서 사용

1. MCP 클라이언트 설정에 다음 내용을 추가하세요:

```json
{
  "mcpServers": {
    "naver-shopping-insight": {
      "command": "node",
      "args": [
        "path/to/naver-shopping-insight-mcp/dist/index.js"
      ],
      "env": {
        "NAVER_CLIENT_ID": "YOUR-CLIENT-ID",
        "NAVER_CLIENT_SECRET": "YOUR-CLIENT-SECRET"
      }
    }
  }
}
```

2. MCP 클라이언트에서 다음 도구들을 사용할 수 있습니다:

   **카테고리별 트렌드 조회:**
   - `get-category-trends`: 분야별 트렌드 조회 (최대 3개 카테고리)
   - `get-category-by-device`: 기기별 트렌드 조회
   - `get-category-by-gender`: 성별 트렌드 조회
   - `get-category-by-age`: 연령별 트렌드 조회

   **키워드별 트렌드 조회:**
   - `get-keyword-trends`: 키워드별 트렌드 조회 (최대 5개 키워드)
   - `get-keyword-by-device`: 키워드 기기별 트렌드 조회
   - `get-keyword-by-gender`: 키워드 성별 트렌드 조회
   - `get-keyword-by-age`: 키워드 연령별 트렌드 조회

## 주요 카테고리 ID

- 패션의류: 50000000
- 화장품/미용: 50000002
- 디지털/가전: 50000003
- 식품: 50000008

## API 제한사항

- **카테고리 배열**: 최대 3개까지만 설정 가능 (`get-category-trends`)
- **키워드 배열**: 최대 5개까지만 설정 가능 (`get-keyword-trends`)
- **일일 호출 한도**: 하루 1,000회

## Claude Desktop 설정

Claude Desktop에서 사용하려면 다음 설정 파일에 추가하세요:

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "naver-shopping-insight": {
      "command": "node",
      "args": [
        "D:\\OneDrive\\Cursorhome\\naver-shopping-insight-mcp\\dist\\index.js"
      ],
      "cwd": "D:\\OneDrive\\Cursorhome\\naver-shopping-insight-mcp",
      "env": {
        "NAVER_CLIENT_ID": "YOUR-CLIENT-ID",
        "NAVER_CLIENT_SECRET": "YOUR-CLIENT-SECRET"
      }
    }
  }
}
```

> **참고**: 경로는 실제 프로젝트 경로로 변경하세요.

## 라이선스

ISC

## 참고 자료

- [네이버 데이터랩 API 문서 > 통합검색어](https://developers.naver.com/docs/serviceapi/datalab/shopping/shopping.md#%EC%87%BC%ED%95%91%EC%9D%B8%EC%82%AC%EC%9D%B4%ED%8A%B8)
- [네이버 데이터랩 API 문서 > 쇼핑인사이트](https://developers.naver.com/docs/serviceapi/search/shopping/shopping.md#%EC%87%BC%ED%95%91)
- [Model Context Protocol](https://modelcontextprotocol.io) 