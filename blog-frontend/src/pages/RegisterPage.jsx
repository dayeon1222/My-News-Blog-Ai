import React from 'react';
import styled from 'styled-components';
import RegisterForm from '../container/auth/RegisterForm';

/**
 * 인증 관련 페이지에서 공통으로 사용되는 배경 레이아웃
 * Flexbox의 중앙 정렬 속성을 활용하여 컨텐츠를 화면 정중앙에 배치함
 */
const AuthLayout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background: #f8f9fa;
`;

/**
 * 회원가입 폼을 감싸는 화이트 박스 디자인
 * LoginPage와 유사한 규격을 유지하여 서비스 전체의 디자인 일관성을 부여함
 */
const AuthBox = styled.div`
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 360px;
  background: white;
  border-radius: 4px;
`;

/**
 * 회원가입 기능을 제공하는 페이지 컴포넌트
 * UI 구조를 정의하는 Styled Components와 실제 가입 로직을 담은 RegisterForm을 조합함
 */
const RegisterPage = () => {
  return (
    <AuthLayout>
      <AuthBox>
        {/**
         * 입력값 검증 및 API 통신 로직이 포함된 회원가입 전용 컨테이너를 렌더링함
         */}
        <RegisterForm />
      </AuthBox>
    </AuthLayout>
  );
};

export default RegisterPage;
