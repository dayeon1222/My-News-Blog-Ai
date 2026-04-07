import Router from 'koa-router';
import posts from './posts/index.js'; // 게시판 기능
import news from './news/index.js'; // 뉴스 기능
import auth from './auth/index.js'; // 인증(로그인/회원가입) 기능

const api = new Router();

// 각각의 세부 라우터들을 메인 API 라우터에 통합

// 게시판 관련 주소: /api/posts 로 시작하도록 설정
api.use('/posts', posts.routes());
// 뉴스 관련 주소: /api/news 로 시작하도록 설정
api.use('/news', news.routes());
// 인증 관련 주소: /api/auth 로 시작하도록 설정
api.use('/auth', auth.routes());

// 다른 파일에서 이 통합 라우터를 사용할 수 있게 내보냄
export default api;
