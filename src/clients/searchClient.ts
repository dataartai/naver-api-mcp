import axios, { AxiosResponse } from 'axios';
import { z } from 'zod';

// 환경 변수에서 API 키 가져오기
const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;

// API 엔드포인트
const API_BASE_URL = 'https://openapi.naver.com/v1/search';

// 공통 검색 요청 스키마
export const SearchRequestSchema = z.object({
  query: z.string().min(1, '검색어는 필수입니다.'),
  display: z.number().int().min(1).max(100).optional().default(10),
  start: z.number().int().min(1).max(1000).optional().default(1)
});

// 블로그 검색 요청 스키마
export const BlogSearchRequestSchema = SearchRequestSchema.extend({
  sort: z.enum(['sim', 'date']).optional().default('sim')
});

// 지식iN 검색 요청 스키마
export const KinSearchRequestSchema = SearchRequestSchema.extend({
  sort: z.enum(['sim', 'date', 'point']).optional().default('sim')
});

// 쇼핑 검색 요청 스키마
export const ShoppingSearchRequestSchema = SearchRequestSchema.extend({
  sort: z.enum(['sim', 'date', 'asc', 'dsc']).optional().default('sim'),
  filter: z.enum(['naverpay']).optional(),
  exclude: z.string().optional() // 예: "used:cbshop"
});

// 백과사전 검색 요청 스키마 (sort 파라미터 없음)
export const EncyclopediaSearchRequestSchema = SearchRequestSchema;

// 검색 결과 아이템 타입
export interface SearchItem {
  title: string;
  link: string;
  description: string;
  [key: string]: any; // 추가 필드들 (API별로 다름)
}

// 검색 응답 타입
export interface SearchResponse {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: SearchItem[];
}

// 블로그 검색 응답 (SearchResponse와 동일하지만 명시적으로)
export type BlogSearchResponse = SearchResponse;

// 지식iN 검색 응답
export type KinSearchResponse = SearchResponse;

// 쇼핑 검색 응답 (추가 필드 포함)
export interface ShoppingSearchItem extends SearchItem {
  image?: string;
  lprice?: number;
  hprice?: number;
  mallName?: string;
  productId?: number;
  productType?: number;
  maker?: string;
  brand?: string;
  category1?: string;
  category2?: string;
  category3?: string;
  category4?: string;
}

export interface ShoppingSearchResponse {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: ShoppingSearchItem[];
}

// 백과사전 검색 응답 (thumbnail 필드 추가)
export interface EncyclopediaSearchItem extends SearchItem {
  thumbnail?: string;
}

export interface EncyclopediaSearchResponse {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: EncyclopediaSearchItem[];
}

// 요청 타입 정의
export type BlogSearchRequest = z.infer<typeof BlogSearchRequestSchema>;
export type KinSearchRequest = z.infer<typeof KinSearchRequestSchema>;
export type ShoppingSearchRequest = z.infer<typeof ShoppingSearchRequestSchema>;
export type EncyclopediaSearchRequest = z.infer<typeof EncyclopediaSearchRequestSchema>;

// 네이버 검색 API 클라이언트 클래스
export class NaverSearchClient {
  private headers: Record<string, string>;

  constructor() {
    if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
      throw new Error('네이버 API 인증 정보가 없습니다. 환경 변수를 확인해주세요.');
    }

    this.headers = {
      'X-Naver-Client-Id': NAVER_CLIENT_ID,
      'X-Naver-Client-Secret': NAVER_CLIENT_SECRET
    };
  }

  /**
   * 블로그 검색
   */
  public async searchBlog(request: BlogSearchRequest): Promise<BlogSearchResponse> {
    return this.sendGetRequest<BlogSearchRequest, BlogSearchResponse>('/blog.json', request);
  }

  /**
   * 지식iN 검색
   */
  public async searchKin(request: KinSearchRequest): Promise<KinSearchResponse> {
    return this.sendGetRequest<KinSearchRequest, KinSearchResponse>('/kin.json', request);
  }

  /**
   * 쇼핑 검색
   */
  public async searchShopping(request: ShoppingSearchRequest): Promise<ShoppingSearchResponse> {
    return this.sendGetRequest<ShoppingSearchRequest, ShoppingSearchResponse>('/shop.json', request);
  }

  /**
   * 백과사전 검색
   */
  public async searchEncyclopedia(request: EncyclopediaSearchRequest): Promise<EncyclopediaSearchResponse> {
    return this.sendGetRequest<EncyclopediaSearchRequest, EncyclopediaSearchResponse>('/encyc.json', request);
  }

  /**
   * GET 요청 공통 메서드
   */
  private async sendGetRequest<T, R>(endpoint: string, params: T): Promise<R> {
    try {
      // Query String 생성
      const queryParams = new URLSearchParams();
      
      Object.entries(params as Record<string, any>).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });

      const url = `${API_BASE_URL}${endpoint}?${queryParams.toString()}`;
      
      const response: AxiosResponse<R> = await axios.get(url, {
        headers: this.headers
      });

      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(`네이버 API 오류: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      }
      throw new Error(`네이버 API 요청 중 오류 발생: ${error.message}`);
    }
  }
}

