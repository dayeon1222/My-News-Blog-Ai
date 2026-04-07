import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

// 💡 최적화: 개발 도구 추가 (캐시 확인용)
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// --- 💡 탠스택 쿼리 전역 최적화 설정 ---
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 1. 데이터가 '신선'하다고 판단되는 시간 (기본 0 -> 1분으로 변경)
      // 이 시간 동안은 페이지를 이동해도 서버에 다시 요청하지 않고 캐시를 씁니다.
      staleTime: 1000 * 60,

      // 2. 데이터가 캐시 메모리에 남아있는 시간 (기본 5분)
      gcTime: 1000 * 60 * 5,

      // 3. 사용자가 다른 창을 봤다가 다시 돌아왔을 때 자동 새로고침 방지
      // 너무 잦은 새로고침을 막아 서버 부하와 깜빡임을 줄입니다.
      refetchOnWindowFocus: false,

      // 4. API 요청 실패 시 재시도 횟수
      // 로그인(401) 에러 등에서 무한 루프를 방지하기 위해 1회로 제한합니다.
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      {/*  개발 모드에서 캐시 상태를 한눈에 볼 수 있는 도구 (배포 시 자동 제외됨) */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
);
