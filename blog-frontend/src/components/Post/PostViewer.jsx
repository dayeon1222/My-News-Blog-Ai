import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { HiLink, HiOutlineArrowLeft } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

// --- Styled Components ---

/**
 * 게시글 상세 보기 페이지의 중앙 정렬 컨테이너
 * 하단 여백을 충분히 주어 마지막 본문 내용이 화면 하단에 붙지 않도록 처리함
 */
const PostViewerBlock = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 30px 20px 100px 20px;
`;

/**
 * 제목과 메타 정보가 포함된 헤더 영역
 * border-bottom을 통해 본문 영역과 시각적으로 구분함
 */
const PostHeader = styled.div`
  border-bottom: 1px solid #eee;
  padding-bottom: 2rem;
  margin-bottom: 3rem;

  h1 {
    font-size: clamp(
      1.8rem,
      5vw,
      2.8rem
    ); /* 뷰포트 너비에 따라 폰트 크기가 유동적으로 변함 */
    margin-bottom: 1.5rem;
    word-break: keep-all; /* 단어 단위로 줄바꿈하여 한글 가독성 향상 */
    line-height: 1.3;
    color: #111;
    font-weight: 800;
  }
`;

/**
 * 작성자, 날짜, 링크 등을 일렬로 배치하는 바
 * flex-wrap을 적용하여 화면이 좁아질 경우 항목들이 아래로 자연스럽게 내려가도록 설정함
 */
const InfoBar = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
`;

/**
 * 외부 뉴스 소스로 연결되는 앵커 태그 스타일
 */
const ReferenceLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
  &:hover {
    text-decoration: underline;
  }
`;

/**
 * 태그들을 모아두는 컨테이너
 */
const TagGroup = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

/**
 * 개별 태그의 텍스트 스타일
 */
const Tag = styled.span`
  color: #3b82f6;
  font-weight: 500;
  font-size: 0.95rem;
`;

/**
 * 수정 및 삭제 버튼이 위치하는 영역
 */
const ActionButtonsWrapper = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
`;

/**
 * 게시글 본문이 표시되는 영역
 * white-space: pre-wrap을 통해 사용자가 입력한 줄바꿈과 공백을 유지함
 */
const PostContent = styled.div`
  font-size: 1.15rem;
  line-height: 1.9; /* 줄 간격을 넓게 설정하여 장문의 가독성 확보 */
  color: #2c3e50;
  min-height: 400px;
  white-space: pre-wrap;
  word-break: break-all;
  margin-bottom: 5rem;

  p {
    margin-bottom: 1.5rem;
  }
`;

/**
 * 하단 목록 이동 버튼을 감싸는 영역
 */
const ListButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 4rem;
  border-top: 1px solid #eee;
  padding-top: 3rem;
`;

/**
 * 목록 이동 버튼 스타일
 * transition과 transform을 결합하여 호버 시 미세하게 떠오르는 효과 구현
 */
const StyledListButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid #ddd;
  padding: 12px 30px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f9fafb;
    border-color: #3b82f6;
    color: #3b82f6;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
  &:active {
    transform: translateY(0);
  }
`;

// --- Main Component ---
const PostViewer = ({ post, loading, error, actionButtons }) => {
  const navigate = useNavigate();

  /**
   * 브라우저 탭의 타이틀을 현재 게시글 제목으로 변경
   * 컴포넌트 언마운트 시 원래 서비스 이름으로 복구하는 cleanup 함수 포함
   */
  useEffect(() => {
    if (post?.title) {
      document.title = `${post.title} - My News AI`;
    }
    return () => {
      document.title = 'My News AI';
    };
  }, [post?.title]);

  /**
   * 뉴스 링크의 프로토콜 유무를 확인하여 올바른 URL 형태로 가공
   * useMemo를 사용하여 post.news 데이터가 변경될 때만 연산을 수행하도록 최적화
   */
  const formattedLink = useMemo(() => {
    if (!post?.news) return null;
    return post.news.startsWith('http') ? post.news : `https://${post.news}`;
  }, [post?.news]);

  /**
   * API 통신 에러 발생 시의 예외 처리 화면
   */
  if (error)
    return (
      <PostViewerBlock>
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <h2>에러가 발생했습니다.</h2>
          <StyledListButton onClick={() => navigate('/blog')}>
            목록으로
          </StyledListButton>
        </div>
      </PostViewerBlock>
    );

  /**
   * 데이터 로딩 중이거나 게시글 데이터가 존재하지 않을 때의 처리
   */
  if (loading || !post)
    return (
      <PostViewerBlock>
        <div style={{ textAlign: 'center', padding: '100px 0', color: '#999' }}>
          콘텐츠를 불러오는 중입니다...
        </div>
      </PostViewerBlock>
    );

  return (
    <PostViewerBlock>
      <PostHeader>
        <h1>{post.title}</h1>
        <InfoBar>
          <span>
            <b>{post.user?.username}</b>
          </span>
          <span>·</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          {post.news && (
            <>
              <span>·</span>
              <ReferenceLink
                href={formattedLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <HiLink /> 원문 뉴스 읽기
              </ReferenceLink>
            </>
          )}
          {!post.news && (
            <>
              <span>·</span>
              <span>직접 입력</span>
            </>
          )}
        </InfoBar>

        <TagGroup>
          {post.tags?.map((tag) => (
            <Tag key={tag}>#{tag}</Tag>
          ))}
        </TagGroup>

        <ActionButtonsWrapper>{actionButtons}</ActionButtonsWrapper>
      </PostHeader>

      <PostContent>{post.body}</PostContent>

      <ListButtonWrapper>
        <StyledListButton onClick={() => navigate('/blog')}>
          <HiOutlineArrowLeft /> 목록으로 돌아가기
        </StyledListButton>
      </ListButtonWrapper>
    </PostViewerBlock>
  );
};

/**
 * 불필요한 리렌더링 방지를 위한 메모이제이션 적용
 */
export default React.memo(PostViewer);
