import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { Link, NavLink } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { useQueryClient } from '@tanstack/react-query';

// --- Styled Components (디자인 및 애니메이션 로직) ---

const HeaderBlock = styled.header`
  position: sticky; /* 스크롤 해도 상단에 고정 */
  top: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.06);
  z-index: 1000;
  box-sizing: border-box;
`;

const Wrapper = styled.div`
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const Logo = styled(Link)`
  font-size: 1.3rem;
  font-weight: 900;
  letter-spacing: -0.5px;
  text-decoration: none;
  color: #3b82f6;
  z-index: 1100; /* 모바일 메뉴보다 위에 표시되도록 설정 */
`;

const MenuTrigger = styled.div`
  display: none; /* 기본적으로는 숨김 */
  font-size: 1.8rem;
  color: #4b5563;
  cursor: pointer;
  z-index: 1100;

  @media (max-width: 768px) {
    display: flex; /* 768px 이하 모바일 화면에서만 보임 */
    align-items: center;
  }
`;

const NavMenu = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    /* 성능 최적화: right 대신 transform을 사용해 하드웨어 가속(GPU) 활용 */
    transform: ${(props) =>
      props.open ? 'translateX(0)' : 'translateX(100%)'};
    width: 280px;
    height: 100vh;
    background: white;
    flex-direction: column;
    padding: 6rem 1.5rem;
    box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    right: 0;
    z-index: 1050;
    /*  가독성/접근성: 메뉴가 닫혔을 때는 화면에서 완전히 숨겨서 탭 포커스 방지 */
    visibility: ${(props) => (props.open ? 'visible' : 'hidden')};
  }
`;

const MenuLink = styled(NavLink)`
  text-decoration: none;
  color: #4b5563;
  font-weight: 600;
  font-size: 1rem;
  transition: color 0.2s;

  &.active {
    color: #3b82f6;
    font-weight: 700;
  }

  &:hover {
    color: #3b82f6;
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
    width: 100%;
    text-align: center;
    padding: 1rem 0;
    border-radius: 12px;
    &:active {
      background: #f3f4f6;
    }
  }
`;

const UserInfo = styled.div`
  font-weight: 800;
  color: #1f2937;
  padding: 0 5px;

  @media (max-width: 768px) {
    padding: 1rem 0;
    font-size: 1.1rem;
    border-bottom: 1px solid #f3f4f6;
    width: 100%;
    text-align: center;
    margin-bottom: 1rem;
  }
`;

const LogoutButton = styled.button`
  border-radius: 50px;
  border: 1px solid #e5e7eb;
  padding: 8px 20px;
  background: white;
  color: #6b7280;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f9fafb;
    border-color: #3b82f6;
    color: #3b82f6;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 12px 0;
    background: #fef2f2; /* 모바일 로그아웃은 경고의 의미로 연한 빨강 배경 */
    color: #ef4444;
    border: none;
  }
`;

const Overlay = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4); /* 배경을 어둡게 만들어 메뉴 집중도 향상 */
    backdrop-filter: blur(2px);
    z-index: 1040;
    /* opacity 조절로 부드러운 등장/퇴장 */
    opacity: ${(props) => (props.open ? 1 : 0)};
    pointer-events: ${(props) => (props.open ? 'auto' : 'none')};
    transition: opacity 0.3s ease;
  }
`;

// --- Main Component (비즈니스 로직) ---

const Header = ({ user, onLogout }) => {
  // 모바일 사이드바 열림/닫힘 상태 관리
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  /* 최적화: useCallback을 사용하여 함수 재성성 방지.
   * 자식 컴포넌트에 함수를 넘겨줄 때 성능 이점이 큼.
   */
  const toggleMenu = useCallback(() => setOpen((prev) => !prev), []);
  const closeMenu = useCallback(() => setOpen(false), []);

  /**
   * 중요 로직: 로그아웃 처리
   * 1. 부모로부터 받은 로그아웃 함수 실행
   * 2. 탠스택 쿼리 캐시를 모두 비워 이전 사용자의 데이터 노출 방지(보안)
   * 3. 모바일 메뉴 닫기
   */
  const handleLogout = useCallback(() => {
    onLogout();
    queryClient.clear(); // 캐시 초기화: 보안 및 데이터 무결성 보장
    closeMenu();
  }, [onLogout, queryClient, closeMenu]);

  return (
    <HeaderBlock>
      <Wrapper>
        {/* 서비스 로고 및 클릭 시 메인 이동 */}
        <Logo to="/" onClick={closeMenu}>
          My News AI
        </Logo>

        {/* 모바일용 햄버거/닫기 아이콘 버튼 */}
        <MenuTrigger onClick={toggleMenu}>
          {open ? <HiX /> : <HiMenu />}
        </MenuTrigger>

        {/* 네비게이션 메뉴 */}
        <NavMenu open={open}>
          <MenuLink to="/" end onClick={closeMenu}>
            뉴스
          </MenuLink>
          <MenuLink to="/blog" onClick={closeMenu}>
            블로그
          </MenuLink>

          {/* 조건부 렌더링: 로그인 상태에 따라 다른 UI 표시 */}
          {user ? (
            <>
              <UserInfo>{user.username}님</UserInfo>
              <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
            </>
          ) : (
            <MenuLink to="/login" onClick={closeMenu}>
              로그인
            </MenuLink>
          )}
        </NavMenu>

        {/* 모바일 메뉴 오픈 시 뒷배경 어둡게 처리 */}
        <Overlay open={open} onClick={closeMenu} />
      </Wrapper>
    </HeaderBlock>
  );
};

/**
 * 최적화: React.memo 사용
 * 전역 헤더이므로 유저 정보가 바뀌지 않았다면 부모의 리렌더링에 영향을 받지 않도록 함.
 */
export default React.memo(Header);
