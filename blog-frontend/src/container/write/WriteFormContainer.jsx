import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import WriteForm from '../../components/write/WriteForm';
import API from '../../api/client';

/**
 * 게시글 작성 및 수정을 위한 데이터 로직을 관리하는 컨테이너 컴포넌트
 * 동일한 폼을 사용하여 신규 등록(POST)과 기존 데이터 수정(PATCH)을 모두 처리함
 */
const WriteFormContainer = () => {
  /**
   * useParams를 통해 URL에 id가 있는지 확인하여 수정 모드 여부를 판단함
   */
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  /**
   * 사용자의 입력값을 관리하는 로컬 상태 정의
   * 프론트엔드 UI에서 사용하는 직관적인 상태 명칭(content, refUrl)을 설정함
   */
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [refUrl, setRefUrl] = useState('');

  /**
   * 수정 모드 시 기존 데이터를 불러오는 로직
   * location.state를 통해 상세 페이지에서 이미 받아온 데이터를 initialData로 활용하여 로딩을 최적화함
   */
  const { data: originalPost } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const res = await client.get(`${API}/api/posts/${id}`);
      return res.data;
    },
    /**
     * id 파라미터가 존재할 때만(수정 모드일 때만) 쿼리를 활성화함
     */
    enabled: !!id,
    initialData: location.state?.post,
  });

  /**
   * 데이터 매핑 처리
   * 서버 데이터 스키마(body, news)를 프론트엔드 상태(content, refUrl)로 변환하여 폼에 주입함
   */
  useEffect(() => {
    if (id && originalPost) {
      setTitle(originalPost.title || '');
      setContent(originalPost.body || '');
      setRefUrl(originalPost.news || '');
      setSelectedTags(originalPost.tags || []);
    }
  }, [id, originalPost]);

  /**
   * 태그 토글 핸들러
   * 이미 선택된 태그는 제거하고, 새로운 태그는 추가하는 배열 연산 수행
   */
  const onTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  /**
   * 데이터 전송(등록 및 수정)을 위한 Mutation 설정
   * id의 존재 여부에 따라 axios의 메서드(patch/post)와 엔드포인트를 동적으로 결정함
   */
  const { mutate, isPending } = useMutation({
    mutationFn: (data) => {
      return id
        ? client.patch(`${API}/api/posts/${id}`, data)
        : client.post(`${API}/api/posts`, data);
    },
    /**
     * 요청 성공 시 처리
     * 관련 쿼리 키를 무효화하여 리스트와 상세 페이지의 데이터를 최신 상태로 유지하고 이동 처리
     */
    onSuccess: (res) => {
      queryClient.invalidateQueries(['posts']);
      queryClient.invalidateQueries(['post', id]);
      alert(id ? '수정되었습니다!' : '등록되었습니다!');

      const targetId = id || res.data._id;
      navigate(`/blog/${targetId}`);
    },
    onError: (e) => {
      alert('처리 중 오류가 발생했습니다.');
    },
  });

  /**
   * 전송 실행 핸들러
   * 프론트엔드 상태값을 다시 백엔드 스키마 필드명(body, news)으로 역매핑하여 전송함
   */
  const onSubmit = () => {
    const data = {
      title,
      body: content,
      news: refUrl,
      tags: selectedTags,
    };
    mutate(data);
  };

  /**
   * Presentational 컴포넌트인 WriteForm에 데이터와 상태 변경 핸들러들을 전달함
   */
  return (
    <WriteForm
      id={id}
      title={title}
      content={content}
      selectedTags={selectedTags}
      refUrl={refUrl}
      onChangeTitle={(e) => setTitle(e.target.value)}
      onChangeContent={(e) => setContent(e.target.value)}
      onChangeRefUrl={(e) => setRefUrl(e.target.value)}
      onTagClick={onTagClick}
      onCancel={() => navigate(-1)}
      onSubmit={onSubmit}
      isPending={isPending}
    />
  );
};

export default WriteFormContainer;
