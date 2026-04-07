import React from 'react';
import styled from 'styled-components';

/**
 * [ Styled Components: 레이아웃 및 스타일 ]
 */

// 1. 배경을 어둡게 덮어주는 전체 화면 영역
const Fullscreen = styled.div`
  position: fixed;
  z-index: 5000; /* 💡 다른 UI(헤더 등)보다 항상 위에 표시되도록 높은 값 설정 */
  inset: 0; /* top, left, bottom, right를 한 번에 0으로 만듬*/
  background: rgba(0, 0, 0, 0.4);

  /* 중앙 정렬: 모달 콘텐츠를 화면 정중앙에 배치 */
  display: flex;
  justify-content: center;
  align-items: center;

  /* 모바일 기기 등에서 화면 끝에 붙지 않도록 최소한의 여백 확보 */
  padding: 1rem;
`;

// 실제 정보가 담긴 흰색 모달 박스
const ModalBlock = styled.div`
  width: 100%;
  max-width: 320px; /* 너무 커지지 않게 제한 */
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.25);
  margin: 0 auto;

  h2 {
    margin-top: 0;
    margin-bottom: 0.75rem;
    font-size: 1.2rem;
    color: #111827;
  }

  p {
    margin-bottom: 1.5rem;
    color: #4b5563;
    line-height: 1.5;
    font-size: 0.95rem;
  }

  .buttons {
    display: flex;
    justify-content: flex-end; /* 버튼을 우측 정렬 */
    gap: 10px;

    /* 반응형: 아주 작은 화면(모바일)에서는 버튼을 1:1 비율로 배치 */
    @media (max-width: 480px) {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
  }
`;

// 재사용 가능한 스타일 버튼
const StyledButton = styled.button`
  padding: 0.7rem 1rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  /* Props에 따른 스타일 분기: 취소 버튼(회색) vs 확인 버튼(빨강) */
  background: ${(props) => (props.$cancel ? '#f3f4f6' : '#ef4444')};
  color: ${(props) => (props.$cancel ? '#4b5563' : 'white')};

  &:active {
    transform: scale(0.96); /* 클릭 시 살짝 작아지는 인터랙션 추가 */
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/**
 * [ Main Component ]
 */

const Modal = ({
  visible, // 모달 표시 여부 (boolean)
  title, // 제목
  description, // 상세 설명
  onConfirm, // 확인 버튼 클릭 시 실행할 함수
  onCancel, // 취소 버튼 클릭 시 실행할 함수
  isLoading, // 서버 통신 중(삭제 중 등) 여부
}) => {
  // 조건부 렌더링: visible이 false면 아무것도 그리지 않음
  if (!visible) return null;

  return (
    /* UX 포인트: 어두운 배경 클릭 시에도 모달이 닫히도록 설정 */
    <Fullscreen onClick={onCancel}>
      {/* 이벤트 전파 방지: 흰색 박스 클릭 시에는 모달이 닫히지 않게 보호 */}
      <ModalBlock onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="buttons">
          <StyledButton $cancel onClick={onCancel} disabled={isLoading}>
            취소
          </StyledButton>
          <StyledButton onClick={onConfirm} disabled={isLoading}>
            {/* UX 포인트: 통신 중일 때 버튼 텍스트를 바꿔 상황을 알림 */}
            {isLoading ? '삭제 중...' : '삭제'}
          </StyledButton>
        </div>
      </ModalBlock>
    </Fullscreen>
  );
};

export default Modal;
