import React from 'react';
import styled, { keyframes } from 'styled-components';

/**
 * 애니메이션 효과 정의
 * 투명도나 색상을 부드럽게 변화시켜 로딩 중임을 사용자에게 인지시키는 기법
 */
const pulse = keyframes`
  0% { background-color: #f2f2f2; }
  50% { background-color: #e5e7eb; }
  100% { background-color: #f2f2f2; }
`;

/**
 * 스켈레톤 UI 전체 컨테이너
 * 실제 콘텐츠가 나타날 영역과 동일한 최대 너비와 여백을 설정하여 레이아웃 이질감을 최소화함
 */
const SkeletonWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
`;

/**
 * 행 단위 레이아웃 정의
 * 그리드 시스템을 사용하여 실제 포스트 리스트의 컬럼 비율과 일치하게 설계함
 */
const SkeletonRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 120px;
  padding: 15px 20px;
  gap: 10px;
  border-bottom: 1px solid #eee;
`;

/**
 * 개별 데이터 항목을 대체하는 스켈레톤 요소
 * 무한 반복되는 pulse 애니메이션을 적용하여 동적인 로딩 상태를 표현함
 */
const SkeletonItem = styled.div`
  height: 20px;
  background-color: #f2f2f2;
  border-radius: 4px;
  animation: ${pulse} 1.5s infinite ease-in-out;
`;

/**
 * 포스트 리스트 로딩 시 표시되는 컴포넌트
 */
const PostListSkeleton = () => {
  return (
    <SkeletonWrapper>
      {/* 글쓰기 버튼 자리 스켈레톤 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '20px',
        }}
      >
        <SkeletonItem style={{ width: '100px', height: '35px' }} />
      </div>
      {/* 헤더 바 */}
      <SkeletonRow style={{ background: '#f8f9fa', borderRadius: '8px' }}>
        {[...Array(5)].map((_, i) => (
          <SkeletonItem key={i} />
        ))}
      </SkeletonRow>
      {/* 리스트 10개 생성 */}
      {[...Array(10)].map((_, i) => (
        <SkeletonRow key={i}>
          {[...Array(5)].map((_, j) => (
            <SkeletonItem key={j} />
          ))}
        </SkeletonRow>
      ))}
    </SkeletonWrapper>
  );
};

export default PostListSkeleton;
