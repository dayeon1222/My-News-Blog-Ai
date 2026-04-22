import Router from 'koa-router';
import * as authCtrl from './auth.ctrl.js';
import ratelimit from 'koa-ratelimit';

const auth = new Router(); //새로운 라우터 인스턴스 생성

const loginLimit = ratelimit({
  driver: 'memory',
  db: new Map(),
  duration: 60000, // 1분 (밀리초 단위)
  errorMessage: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
  id: (ctx) => ctx.ip, // IP 주소를 기준으로 제한
  max: 5, // 최대 횟수
});

//각 주소와 로직연결

auth.post('/register', authCtrl.register); // [회원가입] POST api/auth/register주소로 오면 register함수 실행
auth.post('/login', loginLimit, authCtrl.login); // [로그인] POST api/auth/login주소로 오면 login함수 실행
auth.get('/check', authCtrl.check); // [로그인 상태 확인] api/auth/check주소로 오면 check함수 실행
auth.post('/logout', authCtrl.logout); //[로그아웃] api/auth/logout주소로 오면 logout함수 실행

export default auth;
