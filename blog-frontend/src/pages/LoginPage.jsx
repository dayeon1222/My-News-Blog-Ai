import React from 'react';
import styled from 'styled-components';
import LoginForm from '../container/auth/LoginForm';

/**
 * 로그인 페이지의 전체 배경 및 배치를 담당하는 레이아웃 컴포넌트
 * Flexbox를 사용하여 화면 중앙에 로그인 박스를 수직/수평 정렬함
 */
const AuthLayout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh; /* 뷰포트 높이의 80%를 확보하여 화면 중앙 배치를 유도함 */
  background: #f8f9fa;
`;

/**
 * 로그인 폼이 들어가는 흰색 박스 컨테이너
 * 입체감을 주기 위한 box-shadow와 내부 여백을 설정함
 */
const AuthBox = styled.div`
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 360px;
  background: white;
  border-radius: 2px;
`;

/**
 * 사용자 인증을 위한 로그인 페이지 컴포넌트
 * 독립적인 스타일 컴포넌트와 비즈니스 로직을 담은 LoginForm 컨테이너를 조합함
 */
const LoginPage = () => {
  return (
    <AuthLayout>
      <AuthBox>
        {/**
         * 실제 로그인 관련 상태와 서버 통신 로직을 관리하는 컨테이너를 렌더링함
         */}
        <LoginForm />
      </AuthBox>
    </AuthLayout>
  );
};

export default LoginPage;
