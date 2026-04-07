import styled from 'styled-components';

/**
 * 개별 태그를 나타내는 버튼 컴포넌트
 * Transient Props인 $active를 사용하여 스타일 분기 로직을 처리함
 */
const Chip = styled.button`
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid #3b82f6;
  cursor: pointer;
  transition: all 0.2s ease;

  /**
   * 선택 여부에 따른 동적 스타일 바인딩
   * props.$active 값에 따라 배경색과 글자색을 다르게 적용함
   */
  background-color: ${(props) => (props.$active ? '#3b82f6' : 'white')};
  color: ${(props) => (props.$active ? 'white' : '#3b82f6')};

  &:hover {
    background-color: ${(props) => (props.$active ? '#2563eb' : '#eff6ff')};
  }
`;

/**
 * 태그 칩들을 감싸는 컨테이너
 * flex-wrap 속성을 통해 가로 공간이 부족할 경우 자동으로 줄바꿈 처리함
 */
const TagWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
`;

/**
 * 사용자가 여러 카테고리 중 원하는 태그를 선택할 수 있게 하는 컴포넌트
 */
const TagSelector = ({ selectedTags, onTagClick }) => {
  /**
   * 선택 가능한 고정 카테고리 목록 정의
   */
  const categories = [
    'IT',
    '인공지능',
    '반도체',
    '자율주행',
    'Apple',
    'Samsung',
  ];

  return (
    <TagWrapper>
      {categories.map((tag) => (
        <Chip
          key={tag}
          /**
           * 현재 렌더링 중인 태그가 부모로부터 전달받은 선택 목록(selectedTags)에 포함되어 있는지 확인
           * 포함 여부에 따라 불리언 값을 $active 프롭으로 전달함
           */
          $active={selectedTags.includes(tag)}
          onClick={() => onTagClick(tag)}
          /**
           * 기본 버튼 타입이 submit으로 동작하여 폼이 전송되는 현상을 방지하기 위해 button 타입 명시
           */
          type="button"
        >
          {tag}
        </Chip>
      ))}
    </TagWrapper>
  );
};

export default TagSelector;
