import React from 'react';
import styled, { keyframes } from 'styled-components';

/**
 * [ 1. Animation: Shimmer Effect ]
 * 공부 포인트: keyframes는 재사용 가능한 애니메이션 객체를 만듭니다.
 * 0% -> 50% -> 100% 순서로 배경색을 바꿔서 반짝이는 효과를 줍니다.
 */
const pulse = keyframes`
  0% { background-color: #f2f2f2; }
  50% { background-color: #e5e7eb; }
  100% { background-color: #f2f2f2; }
`;

/**
 * [ 2. SkeletonItem Component ]
 *  공부 포인트 (중요): 프롭 이름 앞에 '$'를 붙이는 이유 (Transient Props)
 * - 리액트에서 커스텀 프롭(marginB 등)을 일반 <div> 태그에 전달하려고 하면 에러가 납니다.
 * - '$'를 붙이면 "이건 스타일용이니까 HTML 태그에는 넣지 마!"라고 리액트에게 알려줍니다.
 */
const SkeletonItem = styled.div`
  /* 전달받은 프롭이 없으면 기본값(|| 뒤의 값)을 사용하도록 설계됨 */
  width: ${(props) => props.$width || '100%'};
  height: ${(props) => props.$height || '20px'};
  margin-bottom: ${(props) => props.$marginB || '0'};
  border-radius: ${(props) => props.$radius || '4px'};
  background: #f2f2f2;
  /* 위에서 정의한 pulse 애니메이션을 1.5초 동안 무한반복 적용 */
  animation: ${pulse} 1.5s infinite ease-in-out;
`;

/**
 * [ 3. Layout Components ]
 */
const ListContainer = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
  /* 💡 미디어 쿼리: 화면 너비가 480px 이하인 모바일 환경 대응 */
  @media (max-width: 480px) {
    margin: 20px auto;
    padding: 0 15px;
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 20px;
  border-left: 4px solid #3b82f6; /* 제목 왼쪽 파란 선 포인트 */
  padding-left: 12px;
`;

const Grid = styled.div`
  display: grid;
  /* 💡 repeat(auto-fill): 공간이 허락하는 한 카드를 자동으로 꽉 채움 */
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  @media (max-width: 480px) {
    gap: 16px;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden; /* 자식 요소(이미지)가 둥근 모서리를 튀어나가지 않게 함 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  cursor: ${(props) => (props.$isSkeleton ? 'default' : 'pointer')};
  transition: all 0.2s ease;

  /* 💡 조건부 스타일: 스켈레톤 로딩 중이 아닐 때만 호버 효과를 줌 */
  ${(props) =>
    !props.$isSkeleton &&
    `
    &:hover {
      transform: translateY(-5px); /* 위로 살짝 뜨는 효과 */
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }
  `}
`;

/**
 * [ 4. Pagination Styling ]
 *  공부 포인트: 버튼의 다양한 상태(Disabled, Hover, Active) 디자인
 */
const PaginationBlock = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 100px; /* 아래쪽 여백을 넉넉히 주어 푸터 공간 확보 */
  gap: 15px;

  span {
    font-weight: bold;
    color: #333;
    font-size: 0.9rem;
  }

  button {
    padding: 10px 20px;
    border: 1px solid #3b82f6;
    background: white;
    color: #3b82f6;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    /* 첫 페이지나 마지막 페이지일 때 버튼 비활성화 스타일 */
    &:disabled {
      border-color: #ddd;
      color: #ccc;
      cursor: not-allowed;
    }

    /* 클릭 시 꾹 눌리는 물리적 느낌의 피드백 */
    &:active:not(:disabled) {
      transform: scale(0.95);
    }

    /* 마우스 올렸을 때 연한 파란색 배경 */
    &:hover:not(:disabled) {
      background: #f0f7ff;
    }
  }
`;

const Thumbnail = styled.div`
  width: 100%;
  height: 180px;
  /* 배경 이미지: $src 프롭이 없으면 플레이스홀더 이미지를 보여줌 */
  background-image: ${(props) =>
    `url("${props.$src || 'https://via.placeholder.com/300'}")`};
  background-size: cover;
  background-position: center;
`;

const NewsContent = styled.div`
  padding: 16px;
  h3 {
    font-size: 1.1rem;
    height: 2.8em;
    overflow: hidden;
    /* 말줄임표 처리: 두 줄이 넘어가면 '...'으로 표시 */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  p {
    font-size: 0.9rem;
    color: #666;
    /* 말줄임표 처리: 세 줄이 넘어가면 '...'으로 표시 */
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

// --- Sub-Components ---

/**
 * [ NewsItem ]
 * React.memo: 프롭이 바뀌지 않으면 재렌더링을 건너뛰어 성능을 최적화합니다.
 */
const NewsItem = React.memo(({ item }) => {
  return (
    <Card onClick={() => window.open(item.url, '_blank')}>
      <Thumbnail $src={item.imageUrl} />
      <NewsContent>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {item.tags?.map((tag) => (
            <span
              key={tag}
              style={{ color: '#3b82f6', fontSize: '12px', fontWeight: 'bold' }}
            >
              #{tag}
            </span>
          ))}
        </div>
        <h3>{item.title}</h3>
        <p>
          {/* AI 요약본이 있으면 로봇 아이콘과 함께 표시, 없으면 본문 앞부분 표시 */}
          {item.summary && !item.summary.includes('(원문 요약)') ? (
            <>
              <strong style={{ color: '#3b82f6' }}>🤖 AI 요약: </strong>
              {item.summary}
            </>
          ) : (
            item.summary ||
            (item.content
              ? item.content.substring(0, 150) + '...'
              : '내용 없음')
          )}
        </p>
        <div style={{ fontSize: '11px', color: '#aaa', marginTop: '12px' }}>
          {item.publishedAt
            ? new Date(item.publishedAt).toLocaleDateString()
            : ''}
        </div>
      </NewsContent>
    </Card>
  );
});

// --- Main Component ---

const NewsList = ({ newsItems, page, onPageClick, isLoading }) => {
  // 로딩 중일 때: 실제 카드 대신 반짝이는 스켈레톤UI 6개를 미리 보여줌
  if (isLoading) {
    return (
      <ListContainer>
        <Title>최신 테크 뉴스</Title>
        <Grid>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Card key={n} $isSkeleton>
              <SkeletonItem $height="180px" $radius="0" />
              <div style={{ padding: '16px' }}>
                <SkeletonItem $width="40%" $height="15px" $marginB="10px" />
                <SkeletonItem $width="100%" $height="24px" $marginB="10px" />
                <SkeletonItem $width="100%" $height="60px" />
              </div>
            </Card>
          ))}
        </Grid>
      </ListContainer>
    );
  }

  // 데이터가 없을 때의 처리
  if (!newsItems || newsItems.length === 0) {
    return (
      <ListContainer>
        <Title>최신 테크 뉴스</Title>
        <div style={{ textAlign: 'center', padding: '100px', color: '#999' }}>
          뉴스가 없습니다.
        </div>
      </ListContainer>
    );
  }

  // 정상적으로 뉴스가 있을 때 화면 렌더링
  return (
    <ListContainer>
      <Title>최신 테크 뉴스</Title>
      <Grid>
        {newsItems.map((item) => (
          <NewsItem key={item._id} item={item} />
        ))}
      </Grid>

      {/* 페이지네이션: 이전/다음 버튼을 통해 페이지 이동 기능 수행 */}
      <PaginationBlock>
        <button disabled={page === 1} onClick={() => onPageClick(page - 1)}>
          이전
        </button>
        <span>{page} 페이지</span>
        <button
          disabled={
            newsItems.length < 10
          } /* 뉴스 개수가 10개 미만이면 다음 페이지가 없다고 가정 */
          onClick={() => onPageClick(page + 1)}
        >
          다음
        </button>
      </PaginationBlock>
    </ListContainer>
  );
};

export default React.memo(NewsList);
