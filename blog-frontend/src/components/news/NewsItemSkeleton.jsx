import React from 'react';
import styled, { keyframes } from 'styled-components';

/**
 * [ Animation: 반짝이는 효과 ]
 * background-color를 연한 회색에서 조금 더 진한 회색으로 부드럽게 변경하여
 * 데이터가 불러와지는 중임을 시각적으로 표현함.
 */
const pulse = keyframes`
  0% { background-color: #f2f2f2; }
  50% { background-color: #e0e0e0; }
  100% { background-color: #f2f2f2; }
`;

/**
 * [ Styled Components: 실제 뉴스 아이템과 동일한 레이아웃 ]
 */
const SkeletonWrapper = styled.div`
  display: flex;
  margin-bottom: 3rem;

  /* 뉴스 이미지 자리 */
  .thumbnail {
    width: 160px;
    height: 100px;
    background: #f2f2f2;
    animation: ${pulse} 1.5s infinite ease-in-out;
  }

  /* 뉴스 제목 및 요약 내용 자리 */
  .contents {
    flex: 1;
    margin-left: 1rem;

    div {
      height: 20px;
      background: #f2f2f2;
      animation: ${pulse} 1.5s infinite ease-in-out;
      margin-bottom: 0.5rem;
    }
  }
`;

/**
 * [ Main Component ]
 * 실제 데이터(NewsItem)가 렌더링되기 전 보여주는 가짜 레이아웃
 */
const NewsItemSkeleton = () => {
  return (
    <SkeletonWrapper>
      {/* 이미지 영역 스켈레톤 */}
      <div className="thumbnail" />

      {/* 텍스트 영역 스켈레톤: 실제 뉴스 제목과 본문의 길이를 흉내냄 */}
      <div className="contents">
        <div style={{ width: '80%' }} /> {/* 제목 느낌 */}
        <div style={{ width: '100%' }} /> {/* 본문 줄 1 */}
        <div style={{ width: '40%' }} /> {/* 본문 줄 2 */}
      </div>
    </SkeletonWrapper>
  );
};

export default NewsItemSkeleton;
