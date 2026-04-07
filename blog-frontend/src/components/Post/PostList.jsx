import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { RiEditLine } from 'react-icons/ri';
import PostActionButtons from '../common/PostActionButtons';
import Modal from '../common/Modal';

// --- Styled Components ---

/**
 * keyframes를 활용한 애니메이션 정의
 * 배경색을 미세하게 변화시켜 로딩 상태임을 시각적으로 전달함
 */
const pulse = keyframes`
  0% { background-color: #f2f2f2; }
  50% { background-color: #e5e7eb; }
  100% { background-color: #f2f2f2; }
`;

/**
 * 블로그 콘텐츠 전체를 감싸는 레이아웃 컴포넌트
 * max-width로 최대 너비를 제한하고 margin을 통해 중앙 정렬 처리
 */
const BlogContentWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px 100px 20px;
  @media (max-width: 480px) {
    padding: 20px 15px 60px 15px;
  }
`;

/**
 * 글쓰기 버튼이 배치되는 상단 섹션
 * flex-end를 사용하여 버튼을 오른쪽 정렬함
 */
const WriteButtonSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
`;

/**
 * 커스텀 글쓰기 버튼 스타일
 * hover 및 active 가상 클래스를 사용하여 사용자 인터랙션 피드백 구현
 */
const StyledWriteButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: #3b82f6;
  border: none;
  color: white;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
  &:hover {
    background-color: #2563eb;
    transform: translateY(-1px);
  }
  &:active {
    transform: scale(0.98);
  }
`;

/**
 * 리스트의 헤더 바
 * 그리드 시스템을 사용하여 제목, 출처, 태그, 날짜, 관리 영역의 비율을 고정함
 */
const ListBar = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 120px;
  background: #f8f9fa;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: bold;
  border-bottom: 2px solid #dee2e6;
  @media (max-width: 768px) {
    display: none; /* 모바일 환경에서는 헤더 바를 숨김 */
  }
`;

/**
 * 개별 포스트 아이템의 레이아웃
 * 데스크톱에서는 그리드 형태를 유지하고, 모바일에서는 flex-column으로 세로 정렬 변경
 */
const PostItemBlock = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 120px;
  background: white;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  align-items: center;
  transition: background 0.2s;
  &:hover {
    background: #fdfdfd;
  }

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 15px;
    border: 1px solid #eee;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }
`;

/**
 * 포스트 제목 스타일
 * word-break를 통해 긴 텍스트가 컨테이너를 벗어나지 않도록 처리
 */
const PostTitle = styled.span`
  cursor: pointer;
  font-weight: 600;
  font-size: 1.05rem;
  word-break: break-all;
  &:hover {
    color: #3b82f6;
  }
`;

/**
 * 메타 정보 섹션
 * display: contents를 활용하여 부모인 그리드 레이아웃의 규칙을 그대로 따르게 설정
 */
const MetaInfo = styled.div`
  display: flex;
  gap: 10px;
  font-size: 0.85rem;
  color: #6b7280;
  @media (min-width: 769px) {
    display: contents;
  }
`;

/**
 * 로딩 중임을 나타내는 스켈레톤 아이템
 * 정의된 pulse 애니메이션을 적용하여 동적인 로딩 효과 부여
 */
const SkeletonItem = styled.div`
  height: 80px;
  background: white;
  margin-bottom: 12px;
  border-radius: 10px;
  animation: ${pulse} 1.5s infinite ease-in-out;
`;

/**
 * 하단 페이지네이션 컨테이너
 */
const PaginationBlock = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 3rem;
  gap: 1rem;
  span {
    font-weight: bold;
    color: #4b5563;
  }
`;

/**
 * 페이지 이동 버튼 스타일
 * disabled 속성을 통해 첫 페이지 혹은 마지막 페이지에서의 비정상 동작 차단
 */
const PageButton = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: white;
  color: #374151;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:disabled {
    color: #ccc;
    background: #f9fafb;
    cursor: not-allowed;
  }
  &:active:not(:disabled) {
    transform: scale(0.95);
  }
`;

/**
 * 개별 포스트 아이템 컴포넌트 분리 및 메모이제이션
 * React.memo를 사용하여 관련 props가 변경되지 않으면 재렌더링을 방지함
 */
const PostItem = React.memo(({ post, user, onDetail, onDeleteClick }) => {
  /**
   * 본인 게시물 여부 확인 로직
   * 현재 로그인한 사용자와 게시물 작성자의 정보를 비교하여 수정/삭제 권한 결정
   */
  const isOwnPost =
    user &&
    (user._id === post.user?._id || user.username === post.user?.username);

  return (
    <PostItemBlock>
      <PostTitle onClick={() => onDetail(post._id)}>{post.title}</PostTitle>

      <MetaInfo>
        <span style={{ color: '#3b82f6', fontWeight: '500' }}>
          {post.news || '직접 입력'}
        </span>
        <span>{post.tags?.join(', ') || '태그 없음'}</span>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </MetaInfo>

      <div style={{ marginTop: '5px' }}>
        {isOwnPost ? (
          <PostActionButtons
            id={post._id}
            onRemoveClick={() => onDeleteClick(post._id)}
          />
        ) : (
          <span style={{ color: '#ccc', fontSize: '0.8rem' }}>권한 없음</span>
        )}
      </div>
    </PostItemBlock>
  );
});

/**
 * 메인 리스트 컴포넌트
 * 로딩 상태, 게시물 유무에 따른 조건부 렌더링 수행
 */
const PostList = ({
  posts,
  isLoading,
  page,
  user,
  onNavigate,
  onDetail,
  onDeleteClick,
  modalVisible,
  onConfirmDelete,
  onCancel,
}) => {
  const navigate = useNavigate();

  /**
   * 로딩 중일 때 표시되는 화면
   * 데이터 구조와 유사한 스켈레톤 UI를 배열 형태로 렌더링
   */
  if (isLoading) {
    return (
      <BlogContentWrapper>
        <WriteButtonSection>
          <div
            style={{
              width: '100px',
              height: '40px',
              background: '#eee',
              borderRadius: '8px',
            }}
          />
        </WriteButtonSection>
        {[1, 2, 3, 4, 5].map((n) => (
          <SkeletonItem key={n} />
        ))}
      </BlogContentWrapper>
    );
  }

  /**
   * 글쓰기 버튼 클릭 이벤트 핸들러
   * 비로그인 사용자의 경우 로그인 페이지로 리다이렉트 처리
   */
  const handleWriteClick = () => {
    if (!user) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
    } else {
      navigate('/write');
    }
  };

  return (
    <>
      <BlogContentWrapper>
        <WriteButtonSection>
          <StyledWriteButton onClick={handleWriteClick}>
            <RiEditLine /> 글쓰기
          </StyledWriteButton>
        </WriteButtonSection>

        <ListBar>
          <span>제목</span>
          <span>출처(News)</span>
          <span>태그</span>
          <span>날짜</span>
          <span>관리</span>
        </ListBar>

        {posts?.length > 0 ? (
          posts.map((post) => (
            <PostItem
              key={post._id}
              post={post}
              user={user}
              onDetail={onDetail}
              onDeleteClick={onDeleteClick}
            />
          ))
        ) : (
          <div
            style={{ textAlign: 'center', padding: '100px 0', color: '#999' }}
          >
            포스트가 없습니다.
          </div>
        )}

        <PaginationBlock>
          <PageButton
            onClick={() => onNavigate(page - 1)}
            disabled={page === 1}
          >
            이전
          </PageButton>
          <span>{page} 페이지</span>
          <PageButton
            onClick={() => onNavigate(page + 1)}
            disabled={!posts || posts.length < 10}
          >
            다음
          </PageButton>
        </PaginationBlock>
      </BlogContentWrapper>

      {/**
       * 삭제 확인 모달 컴포넌트
       * 가시성 제어 및 확인/취소 콜백 함수 연결
       */}
      <Modal
        visible={modalVisible}
        title="포스트 삭제"
        description="정말로 삭제하시겠습니까?"
        onConfirm={onConfirmDelete}
        onCancel={onCancel}
      />
    </>
  );
};

/**
 * 리스트 컴포넌트 전체 메모화
 * 부모 컴포넌트의 리렌더링으로부터 영향을 최소화하여 렌더링 성능 최적화
 */
export default React.memo(PostList);
