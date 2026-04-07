import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

/**
 * [스타일 정의] - 화면의 생김새를 담당 (Styled-components)
 */
const AuthFormBlock = styled.div`
  /* 카드 형태의 흰색 박스 디자인 */
  box-sizing: border-box;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 2.5rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  h3 {
    margin: 0 0 2rem 0;
    color: #111827;
    font-size: 1.5rem;
    font-weight: 800;
    text-align: center;
  }
`;

const StyledInput = styled.input`
  /* 입력창 디자인: 포커스 시 색상 변경 등 인터랙션 포함 */
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.8rem 0 0.8rem 0;
  transition: all 0.2s ease;
  max-width: 450px;
  &:focus {
    border: 1px solid #3b82f6;
  }
  & + & {
    margin-top: 1rem;
  }
`;

const StyledForm = styled.form`
  margin-top: 2rem;
`;

const ButtonWithMarginTop = styled.button`
  margin-top: 1rem;
  width: 100%;
  padding: 0.8rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const Footer = styled.div`
  margin-top: 2rem;
  text-align: right;
  color: #6b7280;
  font-size: 0.875rem;
  a {
    color: #3b82f6;
    text-decoration: underline;
    &:hover {
      color: #2563eb;
    }
  }
`;

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  font-size: 0.875rem;
  margin-top: 1rem;
`;

/**
 * [컴포넌트 본체] - 화면의 뼈대와 데이터를 연결
 */
const textMap = { login: '로그인', register: '회원가입' };
// textMap 활용하여 로그인과 회원가입 동시에 처리

const AuthForm = ({ type, form, onChange, onSubmit, error, loading }) => {
  const text = textMap[type];

  return (
    <AuthFormBlock>
      <h3>{text}</h3>
      <StyledForm onSubmit={onSubmit}>
        {/* 아이디 입력 */}
        <StyledInput
          name="username"
          placeholder="아이디"
          onChange={onChange}
          value={form.username}
        />

        {/* 비밀번호 입력 */}
        <StyledInput
          name="password"
          placeholder="비밀번호"
          type="password"
          onChange={onChange}
          value={form.password}
        />

        {/* 회원가입 시에만 보이는 비밀번호 확인칸 */}
        {type === 'register' && (
          <StyledInput
            name="passwordConfirm"
            placeholder="비밀번호 확인"
            type="password"
            onChange={onChange}
            value={form.passwordConfirm}
          />
        )}

        {/* 에러가 있을 때만 보여주는 메시지 */}
        {error && <ErrorMessage>{error}</ErrorMessage>}

        {/* 버튼 상태 제어: 로딩 중이면 비활성화 */}
        <ButtonWithMarginTop disabled={loading}>
          {loading ? '처리 중...' : text}
        </ButtonWithMarginTop>
      </StyledForm>

      {/* 하단 링크: 로그인/회원가입 페이지 전환 */}
      <Footer>
        {type === 'login' ? (
          <>
            아직 회원이 아니신가요? <Link to="/register">회원가입</Link>
          </>
        ) : (
          <>
            이미 계정이 있으신가요? <Link to="/login">로그인</Link>
          </>
        )}
      </Footer>
    </AuthFormBlock>
  );
};

export default React.memo(AuthForm); // 성능 최적화: 필요한 경우에만 리렌더링
