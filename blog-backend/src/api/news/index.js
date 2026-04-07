import Router from 'koa-router';
import * as newsCtrl from './news.ctrl.js';

const news = new Router();

// 뉴스 관련 API 경로 설정 (라우팅)

news.get('/external', newsCtrl.getExternalNews); // [뉴스 수집] GET /api/news/external - 외부 API에서 뉴스를 긁어와 DB에 저장
news.get('/latest', newsCtrl.getLatestOne); // [헤드라인] GET /api/news/latest - 메인 화면용 가장 최신 뉴스 1건 조회
news.get('/', newsCtrl.list); // [목록 조회] GET /api/news/ - 뉴스 전체 리스트 (페이징, 태그 필터링 포함)
news.post('/:id/summarize', newsCtrl.aiSummarize); // [개별 요약] POST /api/news/:id/summarize - 특정 뉴스에 대해 AI 요약 실행

export default news;
