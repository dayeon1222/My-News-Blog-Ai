import 'dotenv/config'; // 1. 환경변수(.env 파일) 로드
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import mongoose from 'mongoose';
import api from './api/index.js';
import jwtMiddleware from './lib/jwtMiddleware.js';

const app = new Koa();
const router = new Router();
const { PORT, MONGO_URI } = process.env;

// 2. 데이터베이스 연결 (MongoDB)
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('Connected to Mongo DB'))
  .catch((e) => console.error(e));

// 3. 미들웨어 설정 (서버의 기본 옵션들)
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://my-news-blog-ai.netlify.app'], // 프론트엔드(Vite) 주소 허용
    credentials: true, // 쿠키(JWT) 공유를 허용하는 아주 중요한 설정!
  }),
);
app.use(bodyParser()); // 요청 본문(JSON 등)을 해석해줌
app.use(jwtMiddleware); // 모든 요청에 대해 로그인 여부를 먼저 파악함

// 4. 라우터 연결
router.use('/api', api.routes()); // 모든 주소는 /api로 시작함 (예: /api/posts)

// 5. 앱에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

// 6. 서버 실행
const port = PORT || 4000;
app.listen(port, () => console.log(`${port}번 포트에서 서버 시작`));
