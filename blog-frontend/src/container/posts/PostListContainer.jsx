import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import PostList from '../../components/Post/PostList';
import PostListSkeleton from '../../components/Post/PostListSkeleton';

/**
 * 포스트 리스트의 비즈니스 로직을 담당하는 컨테이너 컴포넌트
 * 데이터 페칭(TanStack Query), 페이지네이션 상태, 삭제 모달 제어 등을 수행함
 */
const PostListContainer = () => {
  /**
   * URL의 쿼리 스트링(?page=1)을 읽어오기 위한 Hook
   * 기본값이 없을 경우 1페이지로 간주하도록 처리함
   */
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const page = parseInt(searchParams.get('page') || '1', 10);

  /**
   * 로컬 스토리지에 저장된 유저 정보를 파싱하여 로그인 상태 및 작성자 권한 확인에 사용함
   */
  const user = JSON.parse(localStorage.getItem('user'));

  /**
   * 삭제 확인 모달의 표시 여부와 선택된 포스트의 ID를 관리하는 로컬 상태
   */
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  /**
   * 사이드 이펙트 처리: 페이지가 변경될 때마다 브라우저 창의 스크롤 위치를 최상단으로 초기화함
   */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  /**
   * TanStack Query를 이용한 데이터 조회 로직
   * queryKey에 page를 포함시켜 페이지 번호가 바뀔 때마다 자동으로 새로운 데이터를 요청함
   */
  const {
    data: posts,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['posts', page],
    queryFn: () =>
      axios.get(`${API}/api/posts?page=${page}`).then((res) => res.data),
  });

  /**
   * TanStack Query를 이용한 데이터 삭제 로직
   * 삭제 성공 시 invalidateQueries를 호출하여 캐시된 게시글 목록을 무효화하고 최신 데이터를 다시 불러옴
   */
  const deleteMutation = useMutation({
    mutationFn: (id) =>
      axios.delete(`${API}/api/posts/${id}`, {
        withCredentials: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
      setModalVisible(false);
    },
    onError: (e) => {
      alert(e.response?.data?.message || '삭제 실패');
    },
  });

  /**
   * 페이지 이동 및 상세 페이지 이동을 처리하는 핸들러 함수들
   */
  const onNavigate = (page) => navigate(`/blog?page=${page}`);
  const onDetail = (id) => navigate(`/blog/${id}`);

  /**
   * 삭제 버튼 클릭 시 모달을 띄우고 삭제할 대상 ID를 상태에 저장함
   */
  const onDeleteClick = (id) => {
    setSelectedPostId(id);
    setModalVisible(true);
  };

  /**
   * 모달에서 삭제 승인 시 실제 mutation을 실행함
   */
  const onConfirmDelete = () => {
    if (selectedPostId) deleteMutation.mutate(selectedPostId);
  };

  /**
   * 모달 닫기 및 선택 ID 초기화 처리
   */
  const onCancel = () => {
    setModalVisible(false);
    setSelectedPostId(null);
  };

  /**
   * 조건부 렌더링: 최초 로딩(isLoading) 또는 페이지 전환 중(isFetching)일 때 스켈레톤 UI를 반환함
   */
  if (isLoading || isFetching) {
    return <PostListSkeleton />;
  }

  /**
   * 데이터가 준비되면 Presentational 컴포넌트인 PostList에 가공된 데이터와 핸들러들을 전달함
   */
  return (
    <PostList
      posts={posts}
      isLoading={isLoading}
      page={page}
      user={user}
      onNavigate={onNavigate}
      onDetail={onDetail}
      onDeleteClick={onDeleteClick}
      modalVisible={modalVisible}
      onConfirmDelete={onConfirmDelete}
      onCancel={onCancel}
    />
  );
};

export default PostListContainer;
