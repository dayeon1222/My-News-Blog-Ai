import React from 'react';
import styled from 'styled-components';
// 중요: 로직이 들어있는 컨테이너를 가져옵니다.
import NewsListContainer from '../container/news/NewsListContainer';

/**
 * 페이지의 전반적인 레이아웃을 결정하는 컨테이너
 * 중앙 정렬과 최대 너비를 제한하여 대화면에서도 안정적인 UI를 유지함
 */
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px 20px;
`;

/**
 * 테크 뉴스 목록을 보여주는 페이지 컴포넌트
 * 라우터와 직접 연결되는 단위이며, 실제 데이터 통신이나 상태 관리는 컨테이너에 위임함
 */
const NewsListPage = () => {
  return (
    <PageContainer>
      <h1 style={{ marginBottom: '40px' }}>전체 테크 뉴스</h1>

      {/* 컨테이너를 호출하면, 컨테이너가 알아서 데이터를 가져와서 NewsList(UI)를 보여줍니다. */}
      {/**
       * Container-Presenter 패턴에 따라 비즈니스 로직(데이터 페칭)이 분리된 컨테이너를 렌더링함
       * 이를 통해 페이지 컴포넌트는 레이아웃 정의라는 본연의 역할에 집중할 수 있음
       */}
      <NewsListContainer />
    </PageContainer>
  );
};

export default NewsListPage;
