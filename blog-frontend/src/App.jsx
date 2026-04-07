import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HeaderContainer from './container/common/HeaderContainer';
import axios from 'axios';
import styled from 'styled-components';

// axios 전역 설정
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

// ---  최적화 포인트 1: 코드 분할 (Lazy Loading) ---
// 페이지를 필요한 시점에만 불러와서 초기 번들 크기를 줄입니다.
const Mainpage = lazy(() => import('./pages/Mainpage'));
const NewsListPage = lazy(() => import('./pages/NewsListPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const PostPage = lazy(() => import('./pages/PostPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const WriteFormContainer = lazy(
  () => import('./container/write/WriteFormContainer'),
);

// 로딩 중에 보여줄 단순한 UI (또는 스피너)
const LoadingFallback = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  font-weight: 600;
  color: #3b82f6;
`;

const App = () => {
  useEffect(() => {
    console.log(import.meta.env.VITE_API_URL);
  }, []);
  return (
    <>
      <HeaderContainer />
      {/* ---  최적화 포인트 2: Suspense 활용 --- */}
      {/* Lazy 로딩되는 동안 보여줄 fallback UI를 지정합니다. */}
      <Suspense
        fallback={<LoadingFallback>잠시만 기다려주세요...</LoadingFallback>}
      >
        <Routes>
          <Route path="/" element={<Mainpage />} />
          <Route path="/news" element={<NewsListPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<PostPage />} />
          <Route path="/write" element={<WriteFormContainer />} />
          <Route path="/edit/:id" element={<WriteFormContainer />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
