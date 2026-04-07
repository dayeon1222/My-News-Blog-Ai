import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * [미들웨어] 사용자 인증 토큰(JWT)을 확인하고 유저 정보를 설정함
 */
const jwtMiddleware = async (ctx, next) => {
  // 브라우저 쿠키에서 'access_token'이라는 이름의 토큰을 가져옴
  const token = ctx.cookies.get('access_token');

  // 토큰이 없으면 그냥 다음 단계로 (로그인 안 한 사용자로 간주)
  if (!token) return next();

  try {
    // 토큰이 유효한지 검사 (비밀 키를 대조하여 위변조 확인)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 토큰 안에 들어있는 유저 정보를 ctx.state.user에 저장
    ctx.state.user = {
      _id: decoded._id,
      username: decoded.username,
    };

    // [토큰 재발행 로직] 유효기간이 3.5일 미만으로 남았다면?
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp - now < 60 * 60 * 24 * 3.5) {
      const user = await User.findById(decoded._id);
      const token = user.generateToken(); // 새 토큰 생성

      // 쿠키에 새 토큰을 7일 기한으로 다시 저장 (자동 로그인 연장)
      ctx.cookies.set('access_token', token, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true, // 자바스크립트로 쿠키를 조작하지 못하게 보안 설정
      });
    }

    return next();
  } catch (e) {
    // 토큰 검증 실패 (만료되었거나 잘못된 토큰) 시에도 일단 다음으로 넘김
    // (이후 checkLoggedIn 미들웨어에서 걸러질 예정)
    return next();
  }
};

export default jwtMiddleware;
