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
    origin: (ctx) => {
      const validOrigins = [
        'http://localhost:5173',
        'https://my-news-blog-ai.netlify.app',
      ];
      const origin = ctx.get('Origin');

      // 요청온 주소(origin)가 허용 목록에 있으면 그 주소를 그대로 돌려줌
      if (validOrigins.includes(origin)) {
        return origin;
      }
      // 목록에 없으면 기본적으로 배포된 주소 허용 (또는 null)
      return 'https://my-news-blog-ai.netlify.app';
    },
    credentials: true,
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
