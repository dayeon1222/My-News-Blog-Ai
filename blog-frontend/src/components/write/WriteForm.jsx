import React from 'react';
import styled from 'styled-components';
import { HiLink } from 'react-icons/hi';
import { PrimaryButton, SecondaryButton } from '../common/Button.style';
import TagSelector from './TagSelector';

// --- Styled Components ---

/**
 * 글쓰기 및 수정 페이지의 메인 컨테이너
 * box-sizing 설정을 통해 패딩과 테두리가 전체 너비에 영향을 주지 않도록 제어함
 * 미디어 쿼리를 사용하여 디바이스 크기별로 패딩과 내부 간격을 조정함
 */
const WriteContainer = styled.div`
  box-sizing: border-box;
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 200px;
  display: flex;
  flex-direction: column;
  gap: 15px;

  & * {
    box-sizing: border-box;
  }

  @media (max-width: 1024px) {
    padding: 40px 50px;
  }

  @media (max-width: 768px) {
    padding: 20px 15px;
    gap: 10px;
  }

  h2 {
    font-size: 1.5rem;
    color: #1f2937;
    margin-bottom: 10px;
    @media (max-width: 768px) {
      font-size: 1.25rem;
    }
  }
`;

/**
 * 제목 입력을 위한 커스텀 인풋 스타일
 * 배경을 투명하게 설정하고 하단 보더만 사용하여 세련된 입력 UI를 구성함
 */
const TitleInput = styled.input`
  width: 100%;
  font-size: 24px;
  font-weight: bold;
  padding: 15px 0;
  border: none;
  border-bottom: 2px solid #eee;
  margin-bottom: 20px;
  outline: none;
  transition: border-color 0.3s ease;
  background: transparent;

  @media (max-width: 768px) {
    font-size: 18px;
    margin-bottom: 10px;
  }

  &:focus {
    border-bottom: 2px solid #3b82f6;
  }
  &::placeholder {
    color: #ccc;
    font-weight: normal;
  }
`;

/**
 * 본문 텍스트 입력을 위한 textarea 스타일
 * resize: vertical 속성으로 사용자가 세로 높이만 조절할 수 있도록 제한함
 * focus 시 배경색 변화를 주어 현재 입력 중인 영역을 강조함
 */
const ContentArea = styled.textarea`
  width: 100%;
  min-height: 350px;
  border: 1px solid transparent;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 12px;
  font-size: 16px;
  line-height: 1.6;
  outline: none;
  resize: vertical;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    min-height: 250px;
    font-size: 15px;
    padding: 15px;
  }

  &:focus {
    background-color: #f0f7ff;
    border: 1px solid #dbeafe;
  }
  &::placeholder {
    color: #aaa;
  }
`;

/**
 * 아이콘과 인풋을 나란히 배치하기 위한 래퍼
 * focus-within 가상 클래스를 사용하여 내부 인풋이 포커스될 때 부모의 테두리 색상을 변경함
 */
const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid #eee;
  padding: 10px 0;
  transition: border-color 0.3s;
  &:focus-within {
    border-bottom: 1px solid #3b82f6;
  }
`;

/**
 * 참고 링크 주소 입력을 위한 인풋
 */
const ReferenceInput = styled.input`
  border: none;
  outline: none;
  flex: 1;
  font-size: 14px;
  background: transparent;
  &::placeholder {
    color: #aaa;
  }
`;

/**
 * 하단 제어 버튼들을 모아두는 그룹
 * 모바일 환경에서는 1열 2행의 그리드 레이아웃으로 변경하여 터치 영역을 확보함
 */
const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-top: 10px;
  }
`;

// --- Main Component ---

/**
 * 뉴스 게시글의 등록 및 수정을 담당하는 폼 컴포넌트
 */
const WriteForm = ({
  id,
  title,
  content,
  selectedTags,
  refUrl,
  onChangeTitle,
  onChangeContent,
  onChangeRefUrl,
  onTagClick,
  onCancel,
  onSubmit,
  isPending,
}) => {
  return (
    <WriteContainer>
      {/**
       * id 존재 여부에 따라 수정 모드와 신규 등록 모드의 제목을 구분함
       */}
      <h2>{id ? '뉴스 수정하기' : 'MY News Blog'}</h2>

      <TitleInput
        type="text"
        placeholder="제목을 입력하세요"
        value={title}
        onChange={onChangeTitle}
      />

      {/**
       * 미리 정의된 카테고리를 선택할 수 있는 태그 선택 컴포넌트
       */}
      <TagSelector selectedTags={selectedTags} onTagClick={onTagClick} />

      <ContentArea
        placeholder="내용을 입력하세요"
        value={content}
        onChange={onChangeContent}
      />

      <InputWrapper>
        <HiLink size={20} color="#3b82f6" />
        <ReferenceInput
          placeholder="참고 뉴스 링크를 입력하세요"
          value={refUrl}
          onChange={onChangeRefUrl}
        />
      </InputWrapper>

      <ButtonGroup>
        {/**
         * 데이터 전송 중(isPending)에는 버튼을 비활성화하여 중복 제출을 방지함
         */}
        <SecondaryButton type="button" onClick={onCancel} disabled={isPending}>
          취소
        </SecondaryButton>
        <PrimaryButton onClick={onSubmit} disabled={isPending}>
          {isPending ? '처리 중...' : id ? '수정 완료' : '뉴스 등록하기'}
        </PrimaryButton>
      </ButtonGroup>
    </WriteContainer>
  );
};

/**
 * React.memo를 사용하여 입력값이 변경되지 않는 동안의 불필요한 리렌더링을 차단함
 */
export default React.memo(WriteForm);
