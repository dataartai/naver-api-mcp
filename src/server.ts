import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { 
  NaverShoppingInsightClient, 
  CategoryRequestSchema, 
  KeywordRequestSchema,
  CategorySingleRequestSchema,
  KeywordSingleRequestSchema,
  ShoppingInsightResponse 
} from "./clients/shoppingInsightClient.js";
import {
  NaverSearchClient,
  BlogSearchRequestSchema,
  KinSearchRequestSchema,
  ShoppingSearchRequestSchema,
  EncyclopediaSearchRequestSchema,
  BlogSearchResponse,
  KinSearchResponse,
  ShoppingSearchResponse,
  EncyclopediaSearchResponse
} from "./clients/searchClient.js";

// 네이버 클라이언트 생성
const shoppingInsightClient = new NaverShoppingInsightClient();
const searchClient = new NaverSearchClient();

// MCP 서버 생성
export const createServer = () => {
  const server = new McpServer({
    name: "네이버 API",
    version: "2.0.0"
  });

  // 카테고리 리소스: 분야별 트렌드 정보 제공
  server.resource(
    "categories",
    new ResourceTemplate("naver-shopping-insight://categories/{startDate}/{endDate}/{timeUnit}", { list: undefined }),
    async (uri, { startDate, endDate, timeUnit }) => {
      try {
        const request = {
          startDate: String(startDate),
          endDate: String(endDate),
          timeUnit: String(timeUnit) as "date" | "week" | "month",
          category: [
            { name: "패션의류", param: ["50000000"] },
            { name: "화장품/미용", param: ["50000002"] }
          ]
        };

        const response = await shoppingInsightClient.getCategories(request);
        return {
          contents: [{
            uri: uri.href,
            text: formatResponseAsText(response)
          }]
        };
      } catch (error: any) {
        return {
          contents: [{
            uri: uri.href,
            text: `오류 발생: ${error.message}`
          }]
        };
      }
    }
  );

  // 카테고리 트렌드 조회 도구
  server.tool(
    "get-category-trends",
    {
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      timeUnit: z.enum(["date", "week", "month"]),
      categories: z.array(
        z.object({
          name: z.string(),
          param: z.array(z.string())
        })
      ).max(3).describe("최대 3개까지 설정 가능"),
      device: z.enum(["pc", "mobile", "all"]).optional(),
      gender: z.enum(["m", "f", "a"]).optional(),
      ages: z.array(z.enum(["10", "20", "30", "40", "50", "60"])).optional()
    },
    async ({ startDate, endDate, timeUnit, categories, device, gender, ages }) => {
      try {
        const request = {
          startDate,
          endDate,
          timeUnit,
          category: categories,
          device,
          gender,
          ages
        };

        const response = await shoppingInsightClient.getCategories(request);
        return {
          content: [{ type: "text", text: formatResponseAsText(response) }]
        };
      } catch (error: any) {
        return {
          content: [{ type: "text", text: `오류 발생: ${error.message}` }],
          isError: true
        };
      }
    }
  );

  // 카테고리 기기별 트렌드 조회 도구
  server.tool(
    "get-category-by-device",
    {
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      timeUnit: z.enum(["date", "week", "month"]),
      category: z.string().describe("카테고리 ID (예: 50000000)"),
      device: z.enum(["pc", "mobile", "all"]).optional(),
      gender: z.enum(["m", "f", "a"]).optional(),
      ages: z.array(z.enum(["10", "20", "30", "40", "50", "60"])).optional()
    },
    async ({ startDate, endDate, timeUnit, category, device, gender, ages }) => {
      try {
        const request = {
          startDate,
          endDate,
          timeUnit,
          category, // 단일 문자열
          device,
          gender,
          ages
        };

        const response = await shoppingInsightClient.getCategoryByDevice(request);
        return {
          content: [{ type: "text", text: formatResponseAsText(response) }]
        };
      } catch (error: any) {
        return {
          content: [{ type: "text", text: `오류 발생: ${error.message}` }],
          isError: true
        };
      }
    }
  );

  // 카테고리 성별 트렌드 조회 도구
  server.tool(
    "get-category-by-gender",
    {
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      timeUnit: z.enum(["date", "week", "month"]),
      category: z.string().describe("카테고리 ID (예: 50000000)"),
      device: z.enum(["pc", "mobile", "all"]).optional(),
      gender: z.enum(["m", "f", "a"]).optional(),
      ages: z.array(z.enum(["10", "20", "30", "40", "50", "60"])).optional()
    },
    async ({ startDate, endDate, timeUnit, category, device, gender, ages }) => {
      try {
        const request = {
          startDate,
          endDate,
          timeUnit,
          category, // 단일 문자열
          device,
          gender,
          ages
        };

        const response = await shoppingInsightClient.getCategoryByGender(request);
        return {
          content: [{ type: "text", text: formatResponseAsText(response) }]
        };
      } catch (error: any) {
        return {
          content: [{ type: "text", text: `오류 발생: ${error.message}` }],
          isError: true
        };
      }
    }
  );

  // 카테고리 연령별 트렌드 조회 도구
  server.tool(
    "get-category-by-age",
    {
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      timeUnit: z.enum(["date", "week", "month"]),
      category: z.string().describe("카테고리 ID (예: 50000000)"),
      device: z.enum(["pc", "mobile", "all"]).optional(),
      gender: z.enum(["m", "f", "a"]).optional(),
      ages: z.array(z.enum(["10", "20", "30", "40", "50", "60"])).optional()
    },
    async ({ startDate, endDate, timeUnit, category, device, gender, ages }) => {
      try {
        const request = {
          startDate,
          endDate,
          timeUnit,
          category, // 단일 문자열
          device,
          gender,
          ages
        };

        const response = await shoppingInsightClient.getCategoryByAge(request);
        return {
          content: [{ type: "text", text: formatResponseAsText(response) }]
        };
      } catch (error: any) {
        return {
          content: [{ type: "text", text: `오류 발생: ${error.message}` }],
          isError: true
        };
      }
    }
  );

  // 키워드 트렌드 조회 도구
  server.tool(
    "get-keyword-trends",
    {
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      timeUnit: z.enum(["date", "week", "month"]),
      category: z.string(),
      keywords: z.array(
        z.object({
          name: z.string(),
          param: z.array(z.string())
        })
      ).max(5).describe("최대 5개까지 설정 가능"),
      device: z.enum(["pc", "mobile", "all"]).optional(),
      gender: z.enum(["m", "f", "a"]).optional(),
      ages: z.array(z.enum(["10", "20", "30", "40", "50", "60"])).optional()
    },
    async ({ startDate, endDate, timeUnit, category, keywords, device, gender, ages }) => {
      try {
        const request = {
          startDate,
          endDate,
          timeUnit,
          category,
          keyword: keywords,
          device,
          gender,
          ages
        };

        const response = await shoppingInsightClient.getKeywords(request);
        return {
          content: [{ type: "text", text: formatResponseAsText(response) }]
        };
      } catch (error: any) {
        return {
          content: [{ type: "text", text: `오류 발생: ${error.message}` }],
          isError: true
        };
      }
    }
  );

  // 키워드 기기별 트렌드 조회 도구
  server.tool(
    "get-keyword-by-device",
    {
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      timeUnit: z.enum(["date", "week", "month"]),
      category: z.string().describe("카테고리 ID (예: 50000000)"),
      keyword: z.string().describe("검색 키워드 (예: 정장)"),
      device: z.enum(["pc", "mobile", "all"]).optional(),
      gender: z.enum(["m", "f", "a"]).optional(),
      ages: z.array(z.enum(["10", "20", "30", "40", "50", "60"])).optional()
    },
    async ({ startDate, endDate, timeUnit, category, keyword, device, gender, ages }) => {
      try {
        const request = {
          startDate,
          endDate,
          timeUnit,
          category,
          keyword, // 단일 문자열
          device,
          gender,
          ages
        };

        const response = await shoppingInsightClient.getKeywordByDevice(request);
        return {
          content: [{ type: "text", text: formatResponseAsText(response) }]
        };
      } catch (error: any) {
        return {
          content: [{ type: "text", text: `오류 발생: ${error.message}` }],
          isError: true
        };
      }
    }
  );

  // 키워드 성별 트렌드 조회 도구
  server.tool(
    "get-keyword-by-gender",
    {
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      timeUnit: z.enum(["date", "week", "month"]),
      category: z.string().describe("카테고리 ID (예: 50000000)"),
      keyword: z.string().describe("검색 키워드 (예: 정장)"),
      device: z.enum(["pc", "mobile", "all"]).optional(),
      gender: z.enum(["m", "f", "a"]).optional(),
      ages: z.array(z.enum(["10", "20", "30", "40", "50", "60"])).optional()
    },
    async ({ startDate, endDate, timeUnit, category, keyword, device, gender, ages }) => {
      try {
        const request = {
          startDate,
          endDate,
          timeUnit,
          category,
          keyword, // 단일 문자열
          device,
          gender,
          ages
        };

        const response = await shoppingInsightClient.getKeywordByGender(request);
        return {
          content: [{ type: "text", text: formatResponseAsText(response) }]
        };
      } catch (error: any) {
        return {
          content: [{ type: "text", text: `오류 발생: ${error.message}` }],
          isError: true
        };
      }
    }
  );

  // 키워드 연령별 트렌드 조회 도구
  server.tool(
    "get-keyword-by-age",
    {
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      timeUnit: z.enum(["date", "week", "month"]),
      category: z.string().describe("카테고리 ID (예: 50000000)"),
      keyword: z.string().describe("검색 키워드 (예: 정장)"),
      device: z.enum(["pc", "mobile", "all"]).optional(),
      gender: z.enum(["m", "f", "a"]).optional(),
      ages: z.array(z.enum(["10", "20", "30", "40", "50", "60"])).optional()
    },
    async ({ startDate, endDate, timeUnit, category, keyword, device, gender, ages }) => {
      try {
        const request = {
          startDate,
          endDate,
          timeUnit,
          category,
          keyword, // 단일 문자열
          device,
          gender,
          ages
        };

        const response = await shoppingInsightClient.getKeywordByAge(request);
        return {
          content: [{ type: "text", text: formatResponseAsText(response) }]
        };
      } catch (error: any) {
        return {
          content: [{ type: "text", text: `오류 발생: ${error.message}` }],
          isError: true
        };
      }
    }
  );

  // ========== 검색 API 도구들 ==========

  // 블로그 검색 도구
  server.tool(
    "search-blog",
    {
      query: z.string().min(1, "검색어는 필수입니다."),
      display: z.number().int().min(1).max(100).optional().default(10),
      start: z.number().int().min(1).max(1000).optional().default(1),
      sort: z.enum(["sim", "date"]).optional().default("sim").describe("정렬 방법: sim(정확도순), date(날짜순)")
    },
    async ({ query, display, start, sort }) => {
      try {
        const request = { query, display, start, sort };
        const response = await searchClient.searchBlog(request);
        return {
          content: [{ type: "text", text: formatSearchResponse("블로그", response) }]
        };
      } catch (error: any) {
        return {
          content: [{ type: "text", text: `오류 발생: ${error.message}` }],
          isError: true
        };
      }
    }
  );

  // 지식iN 검색 도구
  server.tool(
    "search-kin",
    {
      query: z.string().min(1, "검색어는 필수입니다."),
      display: z.number().int().min(1).max(100).optional().default(10),
      start: z.number().int().min(1).max(1000).optional().default(1),
      sort: z.enum(["sim", "date", "point"]).optional().default("sim").describe("정렬 방법: sim(정확도순), date(날짜순), point(평점순)")
    },
    async ({ query, display, start, sort }) => {
      try {
        const request = { query, display, start, sort };
        const response = await searchClient.searchKin(request);
        return {
          content: [{ type: "text", text: formatSearchResponse("지식iN", response) }]
        };
      } catch (error: any) {
        return {
          content: [{ type: "text", text: `오류 발생: ${error.message}` }],
          isError: true
        };
      }
    }
  );

  // 쇼핑 검색 도구
  server.tool(
    "search-shopping",
    {
      query: z.string().min(1, "검색어는 필수입니다."),
      display: z.number().int().min(1).max(100).optional().default(10),
      start: z.number().int().min(1).max(1000).optional().default(1),
      sort: z.enum(["sim", "date", "asc", "dsc"]).optional().default("sim").describe("정렬 방법: sim(정확도순), date(날짜순), asc(가격 오름차순), dsc(가격 내림차순)"),
      filter: z.enum(["naverpay"]).optional().describe("필터: naverpay(네이버페이 연동 상품만)"),
      exclude: z.string().optional().describe("제외할 상품 유형: used(중고), rental(렌탈), cbshop(해외직구) 예: 'used:cbshop'")
    },
    async ({ query, display, start, sort, filter, exclude }) => {
      try {
        const request: any = { query, display, start, sort };
        if (filter) request.filter = filter;
        if (exclude) request.exclude = exclude;
        
        const response = await searchClient.searchShopping(request);
        return {
          content: [{ type: "text", text: formatShoppingSearchResponse(response) }]
        };
      } catch (error: any) {
        return {
          content: [{ type: "text", text: `오류 발생: ${error.message}` }],
          isError: true
        };
      }
    }
  );

  // 백과사전 검색 도구
  server.tool(
    "search-encyclopedia",
    {
      query: z.string().min(1, "검색어는 필수입니다."),
      display: z.number().int().min(1).max(100).optional().default(10),
      start: z.number().int().min(1).max(1000).optional().default(1)
    },
    async ({ query, display, start }) => {
      try {
        const request = { query, display, start };
        const response = await searchClient.searchEncyclopedia(request);
        return {
          content: [{ type: "text", text: formatEncyclopediaSearchResponse(response) }]
        };
      } catch (error: any) {
        return {
          content: [{ type: "text", text: `오류 발생: ${error.message}` }],
          isError: true
        };
      }
    }
  );

  // 프롬프트 추가
  server.prompt(
    "naver-api-guide",
    { },
    () => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `네이버 API MCP 서버를 통해 다음과 같은 정보를 조회할 수 있습니다:

[쇼핑인사이트 API]
1. 쇼핑인사이트 분야별 트렌드 조회
2. 쇼핑인사이트 분야 내 기기별/성별/연령별 트렌드 조회
3. 쇼핑인사이트 키워드별 트렌드 조회

[검색 API]
1. 블로그 검색
2. 지식iN 검색
3. 쇼핑 검색
4. 백과사전 검색

주요 카테고리 ID:
- 패션의류: 50000000
- 화장품/미용: 50000002
- 디지털/가전: 50000003
- 식품: 50000008
`
        }
      }]
    })
  );

  return server;
};

// 쇼핑인사이트 응답을 텍스트로 포맷팅하는 유틸리티 함수
function formatResponseAsText(response: ShoppingInsightResponse): string {
  let text = `[네이버 쇼핑인사이트 분석 결과]\n`;
  text += `조회 기간: ${response.startDate} ~ ${response.endDate}\n`;
  text += `시간 단위: ${response.timeUnit}\n\n`;

  for (const result of response.results) {
    text += `항목: ${result.title}\n`;
    
    if (result.category) {
      text += `카테고리: ${result.category.join(', ')}\n`;
    }
    
    if (result.keyword) {
      text += `키워드: ${result.keyword.join(', ')}\n`;
    }
    
    text += '데이터:\n';
    for (const point of result.data) {
      text += `  - ${point.period}: ${point.ratio.toFixed(2)}\n`;
    }
    text += '\n';
  }

  return text;
}

// 검색 응답을 텍스트로 포맷팅하는 유틸리티 함수 (블로그, 지식iN 공통)
function formatSearchResponse(type: string, response: BlogSearchResponse | KinSearchResponse): string {
  let text = `[네이버 ${type} 검색 결과]\n`;
  text += `총 검색 결과: ${response.total.toLocaleString()}개\n`;
  text += `조회 범위: ${response.start} ~ ${response.start + response.display - 1}\n`;
  text += `검색 시간: ${response.lastBuildDate}\n\n`;

  for (let i = 0; i < response.items.length; i++) {
    const item = response.items[i];
    text += `[${i + 1}] ${item.title}\n`;
    text += `링크: ${item.link}\n`;
    text += `설명: ${item.description}\n\n`;
  }

  return text;
}

// 쇼핑 검색 응답을 텍스트로 포맷팅하는 유틸리티 함수
function formatShoppingSearchResponse(response: ShoppingSearchResponse): string {
  let text = `[네이버 쇼핑 검색 결과]\n`;
  text += `총 검색 결과: ${response.total.toLocaleString()}개\n`;
  text += `조회 범위: ${response.start} ~ ${response.start + response.display - 1}\n`;
  text += `검색 시간: ${response.lastBuildDate}\n\n`;

  for (let i = 0; i < response.items.length; i++) {
    const item = response.items[i];
    text += `[${i + 1}] ${item.title}\n`;
    if (item.lprice) {
      text += `가격: ${item.lprice.toLocaleString()}원`;
      if (item.hprice && item.hprice > 0) {
        text += ` ~ ${item.hprice.toLocaleString()}원`;
      }
      text += '\n';
    }
    if (item.mallName) {
      text += `쇼핑몰: ${item.mallName}\n`;
    }
    if (item.brand) {
      text += `브랜드: ${item.brand}\n`;
    }
    if (item.category1) {
      text += `카테고리: ${item.category1}`;
      if (item.category2) text += ` > ${item.category2}`;
      if (item.category3) text += ` > ${item.category3}`;
      text += '\n';
    }
    text += `링크: ${item.link}\n\n`;
  }

  return text;
}

// 백과사전 검색 응답을 텍스트로 포맷팅하는 유틸리티 함수
function formatEncyclopediaSearchResponse(response: EncyclopediaSearchResponse): string {
  let text = `[네이버 백과사전 검색 결과]\n`;
  text += `총 검색 결과: ${response.total.toLocaleString()}개\n`;
  text += `조회 범위: ${response.start} ~ ${response.start + response.display - 1}\n`;
  text += `검색 시간: ${response.lastBuildDate}\n\n`;

  for (let i = 0; i < response.items.length; i++) {
    const item = response.items[i];
    text += `[${i + 1}] ${item.title}\n`;
    if (item.thumbnail) {
      text += `이미지: ${item.thumbnail}\n`;
    }
    text += `설명: ${item.description}\n`;
    text += `링크: ${item.link}\n\n`;
  }

  return text;
} 