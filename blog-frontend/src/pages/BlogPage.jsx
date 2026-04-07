import React from 'react';
import PostListContainer from '../container/posts/PostListContainer';

/**
 * 블로그 목록을 보여주는 페이지 컴포넌트
 * 실제 비즈니스 로직이나 UI 상세 구현 대신, 관련 컨테이너를 배치하여
 * 라우터에 의해 호출되는 독립적인 페이지 단위의 역할을 수행함
 */
const BlogPage = () => {
  return (
    <>
      {/**
       * 데이터 페칭 및 상태 관리를 담당하는 컨테이너를 호출함
       * 이를 통해 페이지 레벨에서는 구체적인 로직을 알 필요 없이 구조만 정의하게 됨
       */}
      <PostListContainer />
    </>
  );
};

export default BlogPage;
