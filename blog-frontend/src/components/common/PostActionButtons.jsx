import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

/**
 * [ Styled Components: 버튼 레이아웃 ]
 */
const ActionButtonsBlock = styled.div`
  display: flex;
  gap: 8px; /* 버튼 사이 간격 */

  button {
    padding: 4px 10px;
    border: 1px solid #ddd;
    background: white;
    cursor: pointer;
    border-radius: 4px;
    font-size: 0.85rem;
    transition: all 0.2s;

    &:hover {
      background: #f0f0f0;
    }
  }
`;

/**
 * [ Main Component ]
 * @param {string} id - 수정할 포스트의 고유 ID
 * @param {function} onRemoveClick - 부모 컴포넌트에서 정의한 삭제 확인 모달 오픈 함수
 */
const PostActionButtons = ({ id, onRemoveClick }) => {
  const navigate = useNavigate(); // 페이지 이동을 위한 훅

  // [ 수정 버튼 클릭 핸들러 ]
  const onEdit = () => {
    // 방어 코드: ID가 없는 예외 상황을 미리 체크하여 에러 방지
    if (!id || id === 'undefined') {
      alert('수정할 포스트의 ID를 찾을 수 없습니다.');
      return;
    }
    // URL 파라미터로 ID를 실어서 수정 페이지로 이동
    navigate(`/edit/${id}`);
  };

  return (
    <ActionButtonsBlock>
      <button onClick={onEdit}>수정</button>

      {/* 삭제 버튼: 스타일을 인라인으로 주어 '위험' 상태를 직관적으로 표현 */}
      <button
        onClick={onRemoveClick} // 부모 컴포넌트에게 "나 삭제 버튼 눌렸어!"라고 알림 (모달 열기 등)
        style={{ color: '#ff4d4f', borderColor: '#ff4d4f' }}
      >
        삭제
      </button>
    </ActionButtonsBlock>
  );
};

export default PostActionButtons;
