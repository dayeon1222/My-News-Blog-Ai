import React from 'react';
import Header from '../../components/common/Header';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import API from '../../api/client';

/**
 * [ API Section: 사용자 상태 체크 ]
 * 서버에 현재 브라우저의 쿠키를 보내서 "나 로그인 되어있니?"라고 물어보는 함수
 */
const checkAPI = async () => {
  try {
    const response = await axios.get(`${API}/api/auth/check`, {
      withCredentials: true, // 중요: 브라우저에 저장된 쿠키(세션/토큰)를 함께 전송
    });
    return response.data; // 로그인 성공 시 유저 정보 반환
  } catch (e) {
    // 401(Unauthorized) 에러는 '로그인이 안 된 상태'일 뿐이므로 null 반환
    if (e.response && e.response.status === 401) {
      return null;
    }
    throw e; // 그 외 서버 다운 등의 진짜 에러는 던짐
  }
};

/**
 * [ Container Component ]
 * UI(Header)와 데이터(React Query)를 연결하는 다리 역할을 함
 */
const HeaderContainer = () => {
  const queryClient = useQueryClient();

  /**
   * TanStack Query로 유저 상태 관리
   * - ['user']라는 키로 유저 데이터를 캐싱함
   * - staleTime: 5분 동안은 매번 서버에 묻지 않고 저장된 데이터 사용 (성능 최적화)
   */
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: checkAPI,
    retry: false, // 비로그인 상태일 때 계속 재시도하는 낭비 방지
    staleTime: 1000 * 60 * 5,
  });

  /**
   *  로그아웃 핸들러
   * - 백엔드 세션 종료 + 로컬 스토리지 정리 + 캐시 초기화 진행
   */
  const onLogout = async () => {
    try {
      // 백엔드에 로그아웃 요청 (서버측 쿠키/세션 파기)
      await axios.post(`${API}/api/auth/logout`, {}, { withCredentials: true });

      // 클라이언트 측 흔적 지우기
      localStorage.removeItem('user');

      // 즉시 UI 반영: 탠스택 쿼리 캐시 정보를 null로 업데이트
      queryClient.setQueryData(['user'], null);

      // 페이지 초기화: 깨끗한 상태로 메인 이동
      window.location.replace('/');
    } catch (e) {
      console.error('백엔드 로그아웃 실패:', e);
      // 실패하더라도 보안을 위해 프론트 데이터는 강제 삭제
      localStorage.removeItem('user');
      queryClient.setQueryData(['user'], null);
      window.location.replace('/');
    }
  };

  // 완성된 데이터와 함수를 UI 컴포넌트(Header)에 전달
  return <Header user={user} onLogout={onLogout} />;
};

export default HeaderContainer;
