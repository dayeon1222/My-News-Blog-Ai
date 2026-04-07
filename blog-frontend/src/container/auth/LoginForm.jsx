import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthForm from '../../components/auth/AuthForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * [컨테이너 컴포넌트] 로그인 로직과 UI(AuthForm)를 연결
 */
const LoginForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // 캐시 데이터 조작을 위한 도구

  // 입력 폼 상태 관리
  const [form, setForm] = useState({ username: '', password: '' });

  // [Mutation] 로그인 서버 요청 정의
  const loginMutation = useMutation({
    // 실제 서버와 통신하는 함수
    mutationFn: (loginData) =>
      axios.post('http://localhost:4000/api/auth/login', loginData, {
        withCredentials: true, // 쿠키(JWT) 공유를 위한 필수 설정!
      }),

    // 로그인 성공 시 실행될 로직
    onSuccess: (response) => {
      const user = response.data;

      // [브라우저 저장] 새로고침 대비용
      localStorage.setItem('user', JSON.stringify(user));

      // [캐시 업데이트] 전역 유저 정보를 즉시 반영 (다른 컴포넌트들이 알 수 있게 함)
      queryClient.setQueryData(['user'], user);

      alert(`${user.username}님, 환영합니다!`);
      navigate('/'); // 메인 페이지로 이동
    },

    // 로그인 실패 시 처리
    onError: () => {
      alert('로그인 실패: 아이디나 비밀번호를 확인하세요.');
    },
  });

  // 입력값 변경 이벤트 핸들러
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // 폼 제출 이벤트 핸들러
  const onSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(form); // Mutation 실행
  };

  return (
    <AuthForm
      type="login"
      form={form}
      onChange={onChange}
      onSubmit={onSubmit}
      isLoading={loginMutation.isPending} // 로딩 상태 전달
    />
  );
};

export default LoginForm;
