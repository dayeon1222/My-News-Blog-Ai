# My News AI 프로젝트 리포트

**AI 기반 테크 뉴스 요약 및 블로그 기능을 제공하는 풀스택 지향 웹 애플리케이션입니다.**

1. 프로젝트 개요
   바쁘고 피곤한 직장인들을 위해 간단한 AI 요약 뉴스와 이를 기록하는 뉴스 블로그를 개발했습니다. 디자인은 호불호 갈리지 않는 무난하고 깔끔한 스타일을 지향했으며, 신뢰감을 주는 블루를 메인 컬러로 사용하여 전문성을 강조했습니다. 또한 **컴포넌트의 재사용성과 데이터 관리의 효율성**에 중점을 두어 설계했습니다.

2. 기술 스택

   프론트엔드 (Frontend)

   Library: React
   State Management: TanStack Query (v5)
   Styling: Styled-components
   Networking: Axios (인스턴스 기반 모듈화)
   Router: React Router DOM (v6)

   백엔드 (Backend)

   Framework: Koa (Node.js)
   Database: MongoDB / Mongoose
   Middleware: Koa-router, Koa-bodyparser 등

3. 핵심 설계 포인트
   Container-Presenter 패턴 적용
   Container: 데이터 페칭(API 통신), 상태 관리, 이벤트 핸들링 등 비즈니스 로직 전담

Presenter: props를 통해 전달받은 데이터를 화면에 렌더링하는 순수 UI 역할 전담

이점: 로직과 디자인의 결합도를 낮추어 코드의 가독성과 유지보수성 향상

사용자 경험(UX) 및 성능 최적화
Skeleton UI: 데이터 로딩 시 실제 레이아웃과 유사한 스켈레톤 애니메이션을 적용하여 체감 대기 시간 감소

Data Caching: TanStack Query의 staleTime을 활용하여 불필요한 서버 요청 최적화

Responsive Design: clamp 함수와 미디어 쿼리를 활용하여 모바일 및 데스크탑 환경 최적화

4. 실행 방법 (Yarn 기준)
   본 프로젝트는 패키지 매니저로 Yarn을 사용합니다.

백엔드 서버 (Koa)

cd backend
yarn install
yarn start:dev

프론트엔드 클라이언트 (React)

cd frontend
yarn install
yarn dev

5. 프로젝트 구조
   뉴스블로그/
   ├── backend/ # Koa 기반 API 서버
   │ └── src/ # API 라우트 및 데이터 모델링
   ├── frontend/ # React 기반 클라이언트
   │ ├── src/
   │ │ ├── components/ # UI 컴포넌트 (Presentational)
   │ │ ├── container/ # 로직 컴포넌트 (Container)
   │ │ ├── pages/ # 페이지 단위 컴포넌트
   │ │ └── lib/ # API 클라이언트 및 유틸리티
   └── README.md # 프로젝트 메인 리포트 6. 향후 업데이트 계획 (Roadmap)
   현재 핵심 기능인 게시글 CRUD와 뉴스 조회 로직이 구현

   ## 6. 관심 분야 및 연구 과제 (Future Work)

   본 프로젝트를 진행하며 다음과 같은 기술적 확장 가능성을 확인했으며, 향후 심화 학습을 통해 적용해 보고자 합니다.

- 대량의 뉴스 데이터 효율적 관리를 위한 어드민 페이지 기획
- 데이터 기반의 뉴스 큐레이션 로직 검토

## 7. 트러블슈팅 및 기술적 성장 (Troubleshooting)

프로젝트를 진행하며 직면한 기술적 과제들과 이를 해결한 과정입니다.

7-1. TanStack Query v5 전환 및 캐시 동기화 이슈
문제: 이전 버전과 다른 v5의 최신 문법 적용 중 데이터가 실시간으로 반영되지 않거나 캐시 오류가 발생함.

해결: staleTime과 gcTime 설정을 통해 데이터의 신선도를 정의하고, 게시글 작성/수정 후에는 queryClient.invalidateQueries를 호출하여 캐시를 강제로 무효화함으로써 사용자에게 항상 최신 데이터를 보여주도록 구현했습니다.

7-2. Styled-components의 Transient Props ($) 도입
문제: 컴포넌트에 전달한 상태값(예: active)이 표준 HTML 속성으로 전달되어 브라우저 콘솔에 경고 메시지가 대량으로 발생하는 현상.

해결: Props 이름 앞에 $ 접두어를 붙이는 Transient Props 기능을 도입하여, 해당 속성이 스타일 정의에만 사용되고 실제 DOM 요소에는 전달되지 않도록 차단하여 에러를 해결했습니다.

7-3. Container-Presenter 패턴 기반 데이터 매핑
문제: 백엔드 API에서 제공하는 필드명(예: body)과 프론트엔드 UI에서 사용하는 명칭이 달라 데이터가 표시되지 않음.

해결: 데이터 통신을 담당하는 Container 계층에서 프론트엔드 규격에 맞게 데이터를 가공(Mapping)하여 Presenter로 넘겨주는 로직을 추가했습니다. 이를 통해 UI 컴포넌트는 오직 출력에만 집중할 수 있는 순수성을 유지했습니다.

7-4. Vite 환경에서의 API 주소 및 경로 관리
문제: 기존 process.env 방식이 Vite 환경에서 동작하지 않아 백엔드 서버와의 연결이 끊기는 문제 발생.

해결: Vite 전용 방식인 import.meta.env를 도입하고, vite.config.js의 alias 설정을 통해 @/와 같은 절대 경로를 지정하여 코드의 가독성과 유지보수성을 확보했습니다.

7-5. Koa 백엔드의 CORS 및 비동기 미들웨어 제어
문제: 프론트엔드와 백엔드의 포트 번호 차이로 인한 CORS 보안 에러 발생.

해결: @koa/cors 미들웨어를 적용하고, Koa의 특징인 async/await 기반 미들웨어 체이닝을 활용하여 요청과 응답의 흐름을 안전하게 제어했습니다.
