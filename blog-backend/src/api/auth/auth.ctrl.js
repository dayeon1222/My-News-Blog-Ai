import Joi from 'joi'; //서버로 들어오는 데이터를 “규칙에 맞는지 검사해주는 검증 라이브러리
import User from '../../models/User.js';

//회원가입
export const register = async (ctx) => {
  // 요청 데이터 검증 (Request Body Validation)
  // 클라이언트가 보낸 데이터가 서버의 규칙에 맞는지 확인합니다.
  const schema = Joi.object({
    username: Joi.string()
      .alphanum() //영문자 숫자만 허용
      .min(3) // 최소 3글자
      .max(20) //최대 20글자
      .required(), // 반드시 있어야함
    password: Joi.string()
      .min(8)
      .pattern(
        new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])'),
      ) // 영문 대소문자, 숫자, 특수문자 조합
      .required()
      .messages({
        'string.pattern.base':
          '비밀번호는 영문 대소문자, 숫자, 특수문자를 모두 포함해야 합니다.',
        'string.min': '비밀번호는 최소 8자 이상이어야 합니다.',
      }), // 문자열로 반드시 있어야함
  });
  const result = schema.validate(ctx.request.body); //검증결과 처리
  if (result.error) {
    //결과값이 에러면
    ctx.status = 400; //400 데이터 형식 이상함
    // 에러 메시지 가공: result.error 전체를 보내지 않고 핵심 메시지만 추출
    ctx.body = {
      message: result.error.details[0].message,
    };
    return; // 종료
  }
  const { username, password } = ctx.request.body; // 클라이언트가 보낸 데이터(body)에서 username과 password만 추출하여 변수에 담음
  try {
    //username 중복방지 중복시 409에러 후 종료
    const exists = await User.findByUsername(username);
    if (exists) {
      ctx.status = 409; // 409는 '충돌'을 의미하며, 이미 존재하는 데이터와 부딪힐 때 사용합니다.
      return;
    }

    const user = new User({
      // 새로운 유저 객체 생성(메모리 단계)
      username,
    });
    // 비밀번호 암호화 (보안의 핵심!)
    // DB에 비밀번호를 그대로 저장하면 위험하므로, 해싱 함수를 거쳐 암호화합니다.
    await user.setPassword(password);
    await user.save(); //데이터베이스에 실제로 저장

    ctx.body = user.serialize();
    // serialize()는 보안상 비밀번호를 제거하고 필요한 정보만 남겨서 사용자에게 돌려줍니다.
    const token = user.generateToken(); //로그인 상태 유지를 위한 토큰 발급
    ctx.cookies.set('access_token', token, {
      //브라우저 쿠키에 토큰 저장
      maxAge: 1000 * 60 * 60 * 24 * 7, //7일간 유지
      httpOnly: true, // 자바스크립트로 쿠키 접근 불가 (보안 강화: XSS 공격 방지)
    });
  } catch (e) {
    ctx.throw(500, e); //서버 내부 에러 발생 시 처리 (예: DB 연결 끊김 등)
    //500-서버코드 실행하다 에러
  }
};
//로그인
export const login = async (ctx) => {
  const { username, password } = ctx.request.body;

  if (!username || !password) {
    ctx.status = 401;
    return;
  }

  try {
    const user = await User.findByUsername(username);
    if (!user) {
      ctx.status = 401;
      return;
    }

    const valid = await user.checkPassword(password);
    if (!valid) {
      ctx.status = 401;
      return;
    }

    const accessToken = user.generateToken();
    const refreshToken = user.generateRefreshToken();

    ctx.body = user.serialize();

    // Access Token 저장 (기존 token 변수 대신 accessToken 사용)
    ctx.cookies.set('access_token', accessToken, {
      maxAge: 1000 * 60 * 60, // 1시간
      httpOnly: true,
    });

    // Refresh Token 저장
    ctx.cookies.set('refresh_token', refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};

//로그인 상태 확인
export const check = async (ctx) => {
  const { user } = ctx.state; // 미들웨어(jwtMiddleware)를 통해 저장된 유저 정보를 가져옴
  if (!user) {
    // 만약 로그인 정보가 없다면 (비로그인 상태)
    ctx.status = 401; // 401 Unauthorized: 인증되지 않은 사용자임을 알림
    return; // 종료
  }
  ctx.body = user; // 로그인 상태라면 유저 정보를 바디에 담아 반환
};

//로그아웃
export const logout = async (ctx) => {
  ctx.cookies.set('access_token', '', {
    // 쿠키 초기화: 'access_token'이라는 이름의 쿠키 값을 비우고 삭제
    maxAge: 0, // 즉시 만료: 브라우저가 이 쿠키를 바로 삭제하도록 설정
    httpOnly: true, // 보안 설정: 로그인 때와 동일하게 설정해야 정확히 삭제됨
  });
  ctx.status = 204; // No Content: 성공적으로 처리됐지만 돌려줄 데이터는 없음
};
