import styled from 'styled-components';

// 기본 버튼 뼈대
export const BaseButton = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

// [등록] 같은 메인 파란 버튼
export const PrimaryButton = styled(BaseButton)`
  background-color: #3b82f6;
  color: white;

  &:hover:not(:disabled) {
    background-color: #2563eb;
    transform: translateY(-1px); /* 살짝 떠오르는 효과 */
  }
`;

// [취소] 같은 서브 회색 버튼
export const SecondaryButton = styled(BaseButton)`
  background-color: #f3f4f6;
  color: #4b5563;

  &:hover:not(:disabled) {
    background-color: #e5e7eb;
  }
`;
