/**
 * [미들웨어] 로그인 여부를 확인하여 비로그인 사용자의 접근을 차단함
 */
const checkLoggedIn = (ctx, next) => {
  // ctx.state.user가 없다는 것은 로그인이 안 되어 있다는 뜻
  if (!ctx.state.user) {
    ctx.status = 401; // 401 Unauthorized: 인증되지 않은 사용자임
    return; // 다음 단계로 보내지 않고 여기서 요청을 종료함
  }

  // 로그인 상태라면 '통과'! 다음 미들웨어(또는 컨트롤러)로 바톤 터치
  return next();
};

export default checkLoggedIn;
