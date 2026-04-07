import axios from 'axios';

/**
 * Axios 인스턴스 생성
 * 서비스 전체에서 사용할 공통 설정(Base URL 등)을 미리 정의하여
 * 매번 전체 주소를 입력해야 하는 번거로움을 줄이고 유지보수성을 높임
 */
const client = axios.create({
  /**
   * API 요청의 기본 주소 설정
   * 모든 요청 주소 앞에 '/api'가 자동으로 붙게 됨
   */
  baseURL: '/api',
});

/**
 * 뉴스 목록 조회를 위한 API 호출 함수
 * 인스턴스화된 client를 사용하여 GET 메서드로 '/api/news'에 요청을 보냄
 * 컴포넌트에서 비즈니스 로직과 통신 로직을 분리하기 위해 이와 같이 export하여 사용함
 */
export const listNews = () => client.get('/news');
