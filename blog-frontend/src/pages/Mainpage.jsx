import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import API from '../api/client';

// --- Animations ---

/**
 * 로딩 상태(스켈레톤)를 시각적으로 보여주기 위한 애니메이션
 * 배경색을 연한 회색 사이에서 부드럽게 순환시킴
 */
const pulse = keyframes`
  0% { background-color: #f2f2f2; }
  50% { background-color: #e5e7eb; }
  100% { background-color: #f2f2f2; }
`;

// --- Styled Components ---

/**
 * 메인 페이지의 최외곽 컨테이너
 * Pretendard 폰트 적용 및 반응형 패딩 설정을 통해 가독성을 확보함
 */
const MainContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px 20px 80px 20px;
  font-family: 'Pretendard', sans-serif;
  box-sizing: border-box;
`;

/**
 * 대형 뉴스 이미지를 보여주는 히어로 섹션
 * props로 전달받은 src를 배경 이미지로 사용하며, background-size: cover로 영역을 꽉 채움
 */
const HeroImage = styled.div`
  width: 100%;
  height: 500px;
  border-radius: 20px;
  background: #eee url('${(props) => props.src}') no-repeat center center;
  background-size: cover;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  margin-top: 30px;
  transition: transform 0.3s ease;

  @media (max-width: 768px) {
    height: 350px;
  }
  @media (max-width: 480px) {
    height: 220px;
    border-radius: 12px;
    margin-top: 20px;
  }
`;

/**
 * 메인 뉴스 제목 스타일
 * clamp 함수를 사용하여 화면 크기에 따라 폰트 사이즈를 유동적으로 조절함
 */
const MainTitle = styled.h1`
  margin-top: 30px;
  font-size: clamp(1.5rem, 5vw, 2.5rem);
  line-height: 1.3;
  word-break: keep-all;
  color: #111;
  font-weight: 800;

  @media (max-width: 480px) {
    margin-top: 20px;
  }
`;

/**
 * AI 요약 내용을 담는 강조 박스
 * 왼쪽 보더 포인트를 주어 일반 본문과 차별화된 디자인을 적용함
 */
const SummaryBox = styled.div`
  margin-top: 30px;
  padding: 30px;
  background-color: #f8f9fa;
  border-left: 6px solid #3b82f6;
  border-radius: 12px;
  line-height: 1.7;

  h3 {
    margin: 0 0 12px 0;
    color: #3b82f6;
    font-size: 1.25rem;
    font-weight: 700;
  }

  p {
    margin: 0;
    color: #374151;
    font-size: 1.05rem;
  }

  @media (max-width: 480px) {
    padding: 20px;
    border-left-width: 4px;
    p {
      font-size: 0.95rem;
    }
  }
`;

/**
 * 다른 페이지로 이동하기 위한 링크 버튼 스타일
 * react-router-dom의 Link 컴포넌트를 styled-components로 확장함
 */
const MoveButton = styled(Link)`
  display: inline-block;
  margin-top: 50px;
  padding: 16px 40px;
  background-color: #3b82f6;
  color: white;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3);

  &:hover {
    background-color: #2563eb;
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  }

  @media (max-width: 480px) {
    display: block;
    width: 100%;
    box-sizing: border-box;
    margin-top: 30px;
  }
`;

// --- Skeleton Components ---

/**
 * 실제 콘텐츠가 로드되기 전 자리를 차지하고 있을 스켈레톤 UI의 기본 구조
 */
const SkeletonBase = styled.div`
  animation: ${pulse} 1.5s infinite ease-in-out;
  background-color: #f2f2f2;
  border-radius: 12px;
`;

const SkeletonHero = styled(SkeletonBase)`
  width: 100%;
  height: 500px;
  margin-top: 30px;
  border-radius: 20px;
  @media (max-width: 768px) {
    height: 350px;
  }
  @media (max-width: 480px) {
    height: 220px;
  }
`;

const SkeletonTitle = styled(SkeletonBase)`
  width: 70%;
  height: 2.5rem;
  margin-top: 30px;
`;

const SkeletonSummary = styled(SkeletonBase)`
  width: 100%;
  height: 160px;
  margin-top: 30px;
`;

// --- Main Component ---

/**
 * 서비스의 대문을 장식하는 메인 페이지 컴포넌트
 */
const MainPage = () => {
  /**
   * TanStack Query를 활용한 최신 뉴스 조회
   * staleTime 설정을 통해 5분 동안은 불필요한 네트워크 재요청을 방지함
   */
  const {
    data: latestNews,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['latestNews'],
    queryFn: async () => {
      const { data } = await API.get('/api/news/latest');
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  /**
   * 데이터 로딩 중일 때 스켈레톤 레이아웃 표시
   */
  if (isLoading) {
    return (
      <MainContainer>
        <SkeletonHero />
        <SkeletonTitle />
        <SkeletonSummary />
      </MainContainer>
    );
  }

  /**
   * 에러 발생 시 사용자에게 보여줄 안내 메시지
   */
  if (isError || !latestNews) {
    return (
      <MainContainer>
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <h2 style={{ color: '#4b5563' }}>뉴스를 불러올 수 없습니다.</h2>
          <p style={{ color: '#9ca3af' }}>잠시 후 다시 시도해주세요.</p>
        </div>
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      {/**
       * 이미지 URL이 없을 경우를 대비한 대체(Fallback) 이미지 설정
       */}
      <HeroImage
        src={latestNews.imageUrl || 'https://picsum.photos/1000/500'}
      />
      <MainTitle>{latestNews.title}</MainTitle>

      <SummaryBox>
        <h3>AI Summary</h3>
        <p>{latestNews.summary || '최신 뉴스의 핵심 요약을 준비 중입니다.'}</p>
      </SummaryBox>

      <div style={{ textAlign: 'center' }}>
        <MoveButton to="/news">전체 뉴스 리스트 보러가기 →</MoveButton>
      </div>
    </MainContainer>
  );
};

/**
 * 불필요한 리렌더링을 막기 위해 컴포넌트 메모화 적용
 */
export default React.memo(MainPage);
