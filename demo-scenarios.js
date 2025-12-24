/**
 * 네이버 쇼핑인사이트 MCP 서버 사용 시나리오 데모
 * 
 * 이 스크립트는 실제 사용 시나리오를 시뮬레이션합니다.
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

// 환경 변수 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '.env');

try {
  const envFile = readFileSync(envPath, 'utf-8');
  envFile.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const match = trimmedLine.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        process.env[key] = value;
      }
    }
  });
} catch (error) {
  console.warn('.env 파일을 읽을 수 없습니다:', error.message);
}

dotenv.config({ override: true });

const { NaverShoppingInsightClient } = await import('./dist/naverClient.js');

// 날짜 계산 헬퍼
function getDateRange(monthsAgo = 1) {
  const today = new Date();
  const pastDate = new Date();
  pastDate.setMonth(today.getMonth() - monthsAgo);
  
  return {
    startDate: pastDate.toISOString().split('T')[0],
    endDate: today.toISOString().split('T')[0]
  };
}

async function runScenario(scenarioName, description, testFunction) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📋 시나리오: ${scenarioName}`);
  console.log(`📝 설명: ${description}`);
  console.log(`${'='.repeat(60)}\n`);
  
  try {
    await testFunction();
    console.log(`\n✅ 시나리오 완료: ${scenarioName}\n`);
  } catch (error) {
    console.error(`\n❌ 시나리오 실패: ${scenarioName}`);
    console.error(`오류: ${error.message}\n`);
  }
}

async function main() {
  const client = new NaverShoppingInsightClient();
  
  // 시나리오 1: 패션 트렌드 분석
  await runScenario(
    '패션 트렌드 분석',
    '최근 1개월간 패션의류 카테고리의 주간 트렌드 조회',
    async () => {
      const { startDate, endDate } = getDateRange(1);
      
      console.log(`📊 요청 정보:`);
      console.log(`   - 기간: ${startDate} ~ ${endDate}`);
      console.log(`   - 카테고리: 패션의류 (50000000)`);
      console.log(`   - 시간 단위: week\n`);
      
      const response = await client.getCategories({
        startDate,
        endDate,
        timeUnit: 'week',
        category: [
          { name: '패션의류', param: ['50000000'] }
        ]
      });
      
      console.log(`📈 결과:`);
      console.log(`   - 조회된 데이터 포인트: ${response.results[0].data.length}개`);
      console.log(`   - 첫 번째 주: ${response.results[0].data[0].period} (비율: ${response.results[0].data[0].ratio.toFixed(2)})`);
      console.log(`   - 마지막 주: ${response.results[0].data[response.results[0].data.length - 1].period} (비율: ${response.results[0].data[response.results[0].data.length - 1].ratio.toFixed(2)})`);
    }
  );
  
  // 시나리오 2: 화장품 키워드 트렌드 분석
  await runScenario(
    '화장품 키워드 트렌드 분석',
    '화장품/미용 카테고리에서 립스틱과 파운데이션 키워드의 트렌드 비교',
    async () => {
      const { startDate, endDate } = getDateRange(1);
      
      console.log(`📊 요청 정보:`);
      console.log(`   - 기간: ${startDate} ~ ${endDate}`);
      console.log(`   - 카테고리: 화장품/미용 (50000002)`);
      console.log(`   - 키워드: 립스틱, 파운데이션`);
      console.log(`   - 시간 단위: week\n`);
      
      const response = await client.getKeywords({
        startDate,
        endDate,
        timeUnit: 'week',
        category: '50000002',
        keyword: [
          { name: '립스틱', param: ['립스틱'] },
          { name: '파운데이션', param: ['파운데이션'] }
        ]
      });
      
      console.log(`📈 결과:`);
      response.results.forEach((result, index) => {
        console.log(`   ${index + 1}. ${result.keyword?.join(', ')}:`);
        console.log(`      - 데이터 포인트: ${result.data.length}개`);
        if (result.data.length > 0) {
          const avgRatio = result.data.reduce((sum, d) => sum + d.ratio, 0) / result.data.length;
          console.log(`      - 평균 비율: ${avgRatio.toFixed(2)}`);
        }
      });
    }
  );
  
  // 시나리오 3: 경쟁 카테고리 비교 분석
  await runScenario(
    '경쟁 카테고리 비교 분석',
    '패션의류, 화장품/미용, 디지털/가전 카테고리의 트렌드 비교',
    async () => {
      const { startDate, endDate } = getDateRange(1);
      
      console.log(`📊 요청 정보:`);
      console.log(`   - 기간: ${startDate} ~ ${endDate}`);
      console.log(`   - 카테고리: 패션의류, 화장품/미용, 디지털/가전`);
      console.log(`   - 시간 단위: week\n`);
      
      const response = await client.getCategories({
        startDate,
        endDate,
        timeUnit: 'week',
        category: [
          { name: '패션의류', param: ['50000000'] },
          { name: '화장품/미용', param: ['50000002'] },
          { name: '디지털/가전', param: ['50000003'] }
        ]
      });
      
      console.log(`📈 결과:`);
      response.results.forEach((result, index) => {
        console.log(`   ${index + 1}. ${result.title}:`);
        console.log(`      - 데이터 포인트: ${result.data.length}개`);
        if (result.data.length > 0) {
          const latestRatio = result.data[result.data.length - 1].ratio;
          console.log(`      - 최신 주 비율: ${latestRatio.toFixed(2)}`);
        }
      });
    }
  );
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`✨ 모든 시나리오 실행 완료!`);
  console.log(`${'='.repeat(60)}\n`);
}

main().catch(console.error);

