import Router from 'koa-router';
import * as postsCtrl from './posts.ctrl.js';
import checkLoggedIn from '../../lib/checkLoggedIn.js';

const posts = new Router();

// 게시글 관련 API 라우팅 설정

// 목록 조회
posts.get('/', postsCtrl.list);

// 글 작성 (로그인 필수)
posts.post('/', checkLoggedIn, postsCtrl.write);

// 특정 포스트 조회 (상세보기)
posts.get('/:id', postsCtrl.getPostById, postsCtrl.read);

// 글 삭제 (로그인 필수 + 작성자 본인 확인)
posts.delete(
  '/:id',
  checkLoggedIn, // 로그인 했어?
  postsCtrl.getPostById, // 그 게시글 존재해?
  postsCtrl.checkOwnPost, // 니가 쓴 글 맞아?
  postsCtrl.remove, // 삭제할게
);

// 글 수정 (로그인 필수 + 작성자 본인 확인)
posts.patch(
  '/:id',
  checkLoggedIn,
  postsCtrl.getPostById,
  postsCtrl.checkOwnPost,
  postsCtrl.update,
);

export default posts;
