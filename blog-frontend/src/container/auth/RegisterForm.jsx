import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthForm from '../../components/auth/AuthForm';
import { useMutation } from '@tanstack/react-query';
import API from '../../api/client';

/**
 * [컨테이너 컴포넌트] 회원가입 로직 담당
 */
const RegisterForm = () => {
  const navigate = useNavigate();

  // 상태 관리 (비밀번호 확인 칸 추가됨)
  const [form, setForm] = useState({
    username: '',
    password: '',
    passwordConfirm: '',
  });

  // [Mutation] 회원가입 서버 요청
  const registerMutation = useMutation({
    mutationFn: (registerData) =>
      axios.post('${API}/api/auth/register', registerData),

    onSuccess: () => {
      alert('회원가입 성공! 로그인해 주세요.');
      navigate('/login'); // 가입 성공하면 로그인 페이지로 유도
    },

    onError: (error) => {
      // 백엔드에서 보낸 에러 코드(409 Conflict) 처리
      if (error.response?.status === 409) {
        alert('이미 존재하는 계정명입니다.');
      } else {
        alert('회원가입 중 오류가 발생했습니다.');
      }
    },
  });

  // 입력값 핸들링
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  // 기존 데이터는 그대로 유지하면서(...form), 사용자가 방금 건드린 그 칸([name])에만 입력한 값(value)을 쏙 집어넣어라!

  // [프론트엔드 검사] 서버에 묻기 전에 미리 확인하기
  const onSubmit = (e) => {
    e.preventDefault();
    const { username, password, passwordConfirm } = form;

    // 빈칸 검사
    if ([username, password, passwordConfirm].includes('')) {
      alert('빈 칸을 모두 채워주세요.');
      return;
    }
    // 비밀번호 일치 검사
    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 모든 통과 시 서버로 데이터 전송 (passwordConfirm은 뺌)
    registerMutation.mutate({ username, password });
  };

  return (
    <AuthForm
      type="register"
      form={form}
      onChange={onChange}
      onSubmit={onSubmit}
      isLoading={registerMutation.isPending}
    />
  );
};

export default RegisterForm;
