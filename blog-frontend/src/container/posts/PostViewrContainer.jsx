import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PostViewer from '../../components/Post/PostViewer';
import PostActionButtons from '../../components/common/PostActionButtons';
import Modal from '../../components/common/Modal';

/**
 * 특정 게시글의 상세 데이터를 관리하고 관련 액션(수정, 삭제)을 처리하는 컨테이너 컴포넌트
 */
const PostViewerContainer = () => {
  /**
   * URL 파라미터에서 게시글의 고유 ID를 추출함
   * App.js의 Route 설정(:id)과 변수명이 일치해야 함
   */
  const { id } = useParams();
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);

  /**
   * 현재 브라우저에 로그인된 유저 정보를 확인하여 본인 글 여부를 판별하는 기초 자료로 활용함
   */
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  /**
   * 단일 게시글 정보를 서버로부터 가져오는 데이터 페칭 로직
   * enabled 옵션을 사용하여 유효한 ID가 존재할 때만 네트워크 요청을 실행하도록 방어함
   */
  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      /**
       * 비정상적인 접근(id가 없거나 문자열 'undefined'인 경우)을 사전 차단함
       */
      if (!id || id === 'undefined') return null;

      const res = await axios.get(`${API}/api/posts/${id}`);
      return res.data;
    },
    /**
     * 조건부 쿼리 실행 제어: 불필요한 서버 부하와 400 Bad Request 에러를 방지함
     */
    enabled: !!id && id !== 'undefined',
  });

  /**
   * 뒤로 가기 또는 목록으로 돌아가기 처리 핸들러
   */
  const onGoBack = () => {
    navigate('/blog');
  };

  /**
   * 수정 페이지 이동 핸들러
   * 이동 시 현재 가지고 있는 post 데이터를 state로 넘겨주어 수정 페이지의 초기 렌더링 속도를 높임
   */
  const onEdit = () => {
    if (!post) return;

    /**
     * MongoDB의 _id 필드와 일반 id 필드 중 존재하는 값을 안전하게 추출함
     */
    const targetId = post._id || post.id || id;

    console.log('추출된 ID:', targetId);

    /**
     * 수정 경로로 이동하며 데이터 객체를 함께 전달함
     */
    navigate(`/edit/${targetId}`, {
      state: { post },
    });
  };

  /**
   * 삭제 확인 모달 제어 함수들
   */
  const onRemoveClick = () => setModal(true);
  const onCancel = () => setModal(false);

  /**
   * 실제 서버에 삭제 요청을 보내는 핸들러
   * 삭제 성공 시 목록 페이지로 이동하며, 실패 시(권한 부족 등) 예외 처리를 수행함
   */
  const onConfirm = async () => {
    setModal(false);
    try {
      await axios.delete(`${API}/api/posts/${id}`);
      navigate('/blog');
    } catch (e) {
      alert('작성자만 삭제할 수 있습니다.');
    }
  };

  /**
   * 현재 로그인한 사용자와 게시글 작성자의 ID를 비교하여 본인 게시물인지 확인하는 로직
   * 데이터 구조에 따라 중첩된 객체 또는 단순 ID 문자열 비교를 모두 수행함
   */
  const ownPost = !!(
    user &&
    post &&
    (post.user?._id === user._id || post.user === user._id)
  );

  return (
    <>
      <PostViewer
        post={post}
        loading={isLoading}
        error={error}
        actionButtons={
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/**
             * 본인 글인 경우에만 수정/삭제 버튼 뭉치를 렌더링함
             */}
            {ownPost && (
              <PostActionButtons
                id={id}
                onRemoveClick={onRemoveClick}
                onEdit={onEdit}
              />
            )}
          </div>
        }
      />
      {/**
       * 사용자 실수 방지를 위한 재확인용 모달 컴포넌트
       */}
      <Modal
        visible={modal}
        title="포스트 삭제"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    </>
  );
};

export default PostViewerContainer;
