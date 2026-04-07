import React from 'react';
import { useParams } from 'react-router-dom';
import PostViewerContainer from '../container/posts/PostViewrContainer';

/**
 * 특정 게시글의 상세 내용을 보여주는 페이지 컴포넌트
 * 라우팅 시스템으로부터 동적 파라미터를 받아와 하위 컨테이너로 전달하는 브릿지 역할을 수행함
 */
const PostPage = () => {
  /**
   * react-router-dom의 useParams Hook을 사용하여 URL 경로에 포함된 고유 ID를 추출함
   * 예: /blog/123 경로로 접속 시 id 변수에 '123'이 할당됨
   */
  const { id } = useParams();

  /**
   * 추출한 id를 PostViewerContainer의 props로 전달함
   * 실제 데이터 페칭 및 상세 UI 렌더링은 이 id를 받은 컨테이너에서 처리됨
   */
  return <PostViewerContainer id={id} />;
};

export default PostPage;
