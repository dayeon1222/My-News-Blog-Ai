import React from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import NewsList from '../../components/news/NewsList';
import API from '../../api/client';

/**
 * [ Container Component ]
 * 데이터 로직(API 호출, 상태 관리)과 UI(NewsList)를 연결합니다.
 */
const NewsListContainer = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation(); // 현재 경로 (예: /, /tech, /science 등)
  const [searchParams] = useSearchParams();

  // URL 쿼리 스트링에서 페이지 번호 추출 (예: ?page=2 -> 2)
  const page = parseInt(searchParams.get('page') || '1', 10);

  /**
   * API 호출 함수
   * 경로(pathname)와 페이지 번호를 파라미터로 전달하여 해당 데이터를 가져옵니다.
   */
  const fetchNews = async () => {
    const response = await API.get(`/api/news?page=${page}&path=${pathname}`);
    return response.data;
  };

  /**
   * TanStack Query (React Query) 설정
   */
  const {
    data: newsItems,
    isLoading,
    isPlaceholderData, // 이전 데이터를 보여주고 있는 상태인지 알려줌
  } = useQuery({
    //  중요: 의존성 배열. pathname이나 page가 바뀌면 자동으로 fetchNews를 재실행함.
    queryKey: ['news', pathname, page],
    queryFn: fetchNews,

    /**
     * 핵심 기법: keepPreviousData
     * 새 데이터를 불러오는 동안 이전 페이지의 데이터를 화면에 유지합니다.
     * 덕분에 로딩 스피너 대신 기존 내용을 보다가 자연스럽게 다음 내용으로 전환됩니다.
     */
    placeholderData: keepPreviousData,

    staleTime: 1000 * 60 * 3, // 3분간 캐시 유지
  });

  /**
   * 페이지 번호 클릭 핸들러
   */
  const onPageClick = (targetPage) => {
    // UX 디테일: 페이지 이동 시 스크롤을 최상단으로 올림
    window.scrollTo(0, 0);

    // URL을 변경하여 리액트 라우터가 감지하게 하고, 결과적으로 useQuery가 새 데이터를 불러오게 함
    navigate(`${pathname}?page=${targetPage}`);
  };

  return (
    <NewsList
      newsItems={newsItems}
      page={page}
      onPageClick={onPageClick}
      /**
       * 지능적 로딩 처리:
       * 데이터가 아예 없을 때(최초 로딩)만 스켈레톤/로딩바를 보여주고,
       * 페이지 전환 시에는 keepPreviousData 덕분에 기존 데이터를 보여주므로 로딩창을 띄우지 않음.
       */
      isLoading={isLoading && !newsItems}
    />
  );
};

export default NewsListContainer;
