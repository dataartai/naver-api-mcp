import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./server.js";
import dotenv from "dotenv";

// 환경 변수가 이미 설정되어 있지 않은 경우에만 .env 파일 로드
// Claude Desktop 등에서 env로 전달된 경우 dotenv 출력이 stdio를 방해할 수 있음
if (!process.env.NAVER_CLIENT_ID || !process.env.NAVER_CLIENT_SECRET) {
  // .env 파일이 있는 경우에만 로드 (출력 억제)
  dotenv.config({ debug: false });
}

// 서버 인스턴스 생성
const server = createServer();

// stdio 트랜스포트 생성 및 연결
const transport = new StdioServerTransport();

// 서버 시작
async function startServer() {
  try {
    console.error("네이버 쇼핑인사이트 MCP 서버 시작 중...");
    await server.connect(transport);
    console.error("네이버 쇼핑인사이트 MCP 서버가 성공적으로 시작되었습니다.");
  } catch (error) {
    console.error("서버 시작 중 오류 발생:", error);
    process.exit(1);
  }
}

startServer(); 