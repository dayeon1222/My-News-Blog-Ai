import mongoose from 'mongoose';
import Post from '../../models/Post.js';

// [글 작성]
export const write = async (ctx) => {
  const { title, body, tags } = ctx.request.body; // 제목, 바디, 뉴스, 태그 추출
  try {
    const post = new Post({
      // 새로운 Post 인스턴스 생성
      title,
      body,
      tags,
      // 현재 로그인된 사용자의 정보를 게시글에 함께 기록 (중요!)
      // jwtMiddleware를 통해 ctx.state.user에 담긴 인증 정보를 사용함
      user: {
        _id: ctx.state.user._id,
        username: ctx.state.user.username,
      },
    });
    await post.save(); // 데이터베이스에 최종 저장
    ctx.body = post; // 저장된 결과를 클라이언트에 응답
  } catch (e) {
    // 실패시 500에러 메시지
    ctx.status = 500;
    ctx.body = { message: '포스트 저장 실패', error: e.message };
  }
};

// [목록 조회]
export const list = async (ctx) => {
  // 페이지번호 파라미터 처리
  const page = parseInt(ctx.query.page || '1', 10);

  if (page < 1) {
    // 1페이지보다 작으면 400 에러처리
    ctx.status = 400;
    return;
  }

  try {
    const posts = await Post.find() // 게시글 데이터 조회
      .sort({ _id: -1 }) // 최신순 정렬
      .limit(10) // 10개씩
      .skip((page - 1) * 10) // 10개 넘어가면 다음 페이지
      .lean() // 중요: 데이터를 처음부터 JSON 형태로 가져와서 성능 최적화
      .exec();

    // 조회된 게시글 목록 응답
    ctx.body = posts;
  } catch (e) {
    ctx.throw(500, e); // 500에러 처리
  }
};

// [미들웨어: ID로 포스트를 찾아서 ctx.state.post에 담기]
export const getPostById = async (ctx, next) => {
  const { id } = ctx.params;

  //  형식이 맞는지 확인
  if (!mongoose.Types.ObjectId.isValid(id)) {
    ctx.status = 400; // Bad Request
    ctx.body = { message: '잘못된 ID 형식입니다.' };
    return;
  }

  try {
    const post = await Post.findById(id); // 포스트 id찾기
    if (!post) {
      ctx.status = 404; // Not Found
      ctx.body = { message: '포스트가 존재하지 않습니다.' };
      return;
    }
    ctx.state.post = post; // 찾은 포스트를 ctx.state.post에 저장
    return next(); // 다음 미들웨어 또는 다음 컨트롤러 이동
  } catch (e) {
    ctx.throw(500, e);
  }
};

// [미들웨어: 작성자 본인인지 확인]
export const checkOwnPost = (ctx, next) => {
  const { user, post } = ctx.state; //이전 미들웨어(jwt, getPostById)에서 담아준 정보 꺼내기

  // 유저 정보나 포스트 정보가 아예 없는 경우 차단
  if (!user || !post) {
    ctx.status = 401; // 401 에러와 메시지
    ctx.body = { message: '로그인이 필요하거나 게시글을 찾을 수 없습니다.' };
    return;
  }

  // ID 비교
  // post.user가 객체일 수도 있고 ID 문자열일 수도 있으므로, 양쪽 다 .toString()으로 강제 변환해서 비교
  const postId = post.user._id
    ? post.user._id.toString()
    : post.user.toString();
  const userId = user._id.toString();

  //DEBUG
  // console.log('--- 권한 검증 로그 ---');
  // console.log('현재 로그인 유저 ID:', userId);
  // console.log('게시글 작성자 ID:', postId);

  if (postId !== userId) {
    ctx.status = 403; // 유저아이디와 포스트아이디가 다를 경우 403 접근금지
    ctx.body = { message: '작성자만 수정/삭제할 수 있습니다.' };
    return;
  }

  // 일치하면 통과
  return next();
};
// [특정 포스트 조회]
export const read = (ctx) => {
  // ctx.state.post 데이터를 바디에
  ctx.body = ctx.state.post;
};

// [수정]
export const update = async (ctx) => {
  const { id } = ctx.params; // id 정보 꺼내기
  try {
    // ID로 찾아서 요청받은 내용(ctx.request.body)으로 업데이트
    const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
      new: true, // 업데이트된 결과를 반환
      // 설정 안 하면 수정 전 데이터가 반환됨! true여야 수정 후 데이터를 즉시 확인 가능
    });
    ctx.body = post; // 수정 성공시 결과 반환
  } catch (e) {
    ctx.status = 500; // 수정 실패시 에러 500 처리
    ctx.body = { message: '수정 실패', error: e.message };
  }
};

// [삭제]
export const remove = async (ctx) => {
  const { id } = ctx.params; // id 꺼내오기
  try {
    await Post.findByIdAndDelete(id); // 데이터베이스에서 해당 ID를 가진 포스트를 찾아 즉시 삭제
    ctx.status = 204; // No Content 204 반환
  } catch (e) {
    ctx.status = 500; // 실패시 500
    ctx.body = { message: '삭제 실패', error: e.message };
  }
};
