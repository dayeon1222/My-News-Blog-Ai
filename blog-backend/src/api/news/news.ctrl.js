import News from '../../models/news.js';
import axios from 'axios';
import * as aiLib from '../../lib/ai.js';

//  시간 지연 함수 (API 할당량 초과 방지용)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getExternalNews = async (ctx) => {
  //최신 기사 수집
  try {
    // 외부 뉴스 API 호출
    const response = await axios.get(
      'https://newsapi.org/v2/everything?q=(IT OR 테크 OR 반도체 OR 인공지능)&language=ko&sortBy=publishedAt&apiKey=72ad28107e294b1da2a9099aa846927b',
    );
    const articles = response.data.articles; // 외부 API에서 가져온 뉴스 데이터를 서비스 규격에 맞게 정제
    const refinedNews = articles
      // 필터링: 이미지가 없는 기사는 사용자 경험(UX)을 위해 제외함
      .filter((item) => item.urlToImage)
      // 데이터 변환: 필요한 필드만 추출하고 새로운 속성(태그)을 부여함
      .map((item) => {
        const tags = ['IT'];
        const title = item.title || '';
        //  키워드 기반 자동 태깅 시스템
        // 제목에 특정 단어가 포함되어 있으면 관련 태그를 추가함
        if (
          title.includes('AI') ||
          title.includes('인공지능') ||
          title.includes('로봇')
        )
          tags.push('인공지능');
        if (title.includes('반도체') || title.includes('칩'))
          tags.push('반도체');
        if (title.includes('애플') || title.includes('iPhone'))
          tags.push('Apple');
        if (title.includes('삼성')) tags.push('Samsung');
        if (title.includes('자율주행')) tags.push('자율주행');
        return {
          // 최종 데이터 구조 생성 (응답 객체 규격화)
          title: title || '제목 없음',
          content: item.description || '내용 없음',
          url: item.url,
          imageUrl: item.urlToImage,
          publishedAt: item.publishedAt,
          tags: tags, // 위에서 만든 커스텀 태그 배열 포함
        };
      });

    // 신규 뉴스 저장
    for (const newsData of refinedNews) {
      // 중복 체크: 현재 뉴스 제목으로 이미 DB에 저장된 뉴스가 있는지 확인
      let newsItem = await News.findOne({ title: newsData.title });
      if (!newsItem) {
        //  신규 저장: DB에 해당 제목의 뉴스가 없는 경우에만 새로 저장
        newsItem = new News(newsData); //새로운 뉴스 객체 생성
        await newsItem.save(); //실제로 DB에 저장
      }
    }

    // DB에 저장된 뉴스 중 요약이 필요한 모든 뉴스 추출
    // 요약이 아예 없거나, 임시 요약(원문 요약)만 있는 뉴스를 최대 10개씩 가져와서 처리
    const pendingNews = await News.find({
      $or: [
        //조건 만족하면 가져옴
        { summary: { $exists: false } }, // 요약 필드가 아예 없는 경우
        { summary: '' }, // 요약 필드는 있지만 내용은 비어있는 경우
        { summary: { $regex: /\(원문 요약\)/ } }, // 원문 요약만 들어가 있는 경우
      ],
    }).limit(10); //10개만 가져오기

    // console.log(`요약 대기 중인 뉴스 발견: ${pendingNews.length}건`); //DEBUG: 요약 건수 확인용

    // 요약 수행 루프
    for (const newsItem of pendingNews) {
      // 요약 대기 중인 뉴스들을 하나씩 처리 (반복문)
      if (newsItem.content && newsItem.content !== '내용 없음') {
        // 본문 내용이 제대로 있을 때만 AI 요약 진행
        try {
          console.log(`🤖 AI 요약 시도 중: ${newsItem.title}`);

          // API 할당량 보호: 뉴스 하나당 3초 대기
          await delay(3000);

          const summary = await aiLib.generateSummary(newsItem.content);
          // [AI 호출] AI 라이브러리를 통해 본문 내용을 요약문으로 생성

          await News.updateOne(
            // [DB 업데이트] 생성된 요약문을 해당 뉴스 데이터에 저장
            { _id: newsItem._id },
            { $set: { summary: summary } },
          );
          console.log(`요약 완료: ${newsItem.title}`);
        } catch (aiError) {
          // 예외 처리: AI 요약 중 에러 발생 시 (API 키 만료, 네트워크 오류 등)
          console.error(`AI 요약 실패: ${aiError.message}`);

          // 실패 시 본문 앞부분 150글자 채워넣기
          if (!newsItem.summary || !newsItem.summary.includes('(원문 요약)')) {
            const fallback =
              newsItem.content.substring(0, 150) + '... (원문 요약)';
            await News.updateOne(
              { _id: newsItem._id },
              { $set: { summary: fallback } },
            );
          }

          // 할당량 초과(429) 시 루프 중단
          if (aiError.message.includes('429')) {
            console.log('할당량 초과로 인해 이번 차수 요약을 중단합니다.');
            break;
          }
        }
      }
    }

    ctx.body = {
      //성공시 메세지 보여주고 뉴스 넣기
      message: '뉴스 수집 및 AI 자동 요약 프로세스 완료!',
      newCount: refinedNews.length, // 이번에 새로 DB에 추가된 뉴스 개수
      summarizedCount: pendingNews.length, // 이번에 AI 요약을 시도한 뉴스 개수
    };
  } catch (e) {
    //실패시 500 에러와 메시지 띄어주기
    //500 : 서버코드 실행하다 에러
    ctx.status = 500;
    ctx.body = e.message;
  }
};

export const list = async (ctx) => {
  // 저장된 뉴스 목록을 조회
  // 주소창의 ?page=2 등에서 페이지 번호를 가져오고, 없으면 기본값 '1'을 사용
  const page = parseInt(ctx.query.page || '1', 10);
  const { tag } = ctx.query; // ?tag=삼성 처럼 특정 태그가 있는지 확인
  if (page < 1) {
    // 잘못된 페이지 방어
    ctx.status = 400; // 잘못되면 데이터 형식 이상함 400 에러
    return; // 종료
  }
  // 필터 조건 설정
  const query = tag ? { tags: tag } : {};
  // 태그가 있으면 해당 태그만, 없으면 모든 뉴스를 조회하도록 쿼리 생성
  try {
    // 데이터 베이스 조회
    const news = await News.find(query)
      .sort({ publishedAt: -1 }) //최신순
      .limit(10) //10개만
      .skip((page - 1) * 10) // 2페이지되면 10개 건너뛰기
      .exec();

    //전체페이지수 계산
    const newsCount = await News.countDocuments(query).exec();
    ctx.set('Last-Page', Math.ceil(newsCount / 10));
    // 응답 헤더에 '마지막 페이지 번호' 정보를 담아서 보냄
    ctx.body = news; //결과 반환
  } catch (e) {
    ctx.status = 500;
    ctx.body = e.message;
  }
};

// 가장 최근에 발행된 뉴스 1건 조회
export const getLatestOne = async (ctx) => {
  try {
    // 데이터 베이스에서 조건에 맞는  딱 하나의 데이터만 찾음
    const latestNews = await News.findOne({}).sort({ publishedAt: -1 }).exec();
    if (!latestNews) {
      // 만약 저장된 뉴스가 없다면
      ctx.status = 404; // Not Found
      ctx.body = { message: '뉴스가 없습니다.' };
      return;
    }
    ctx.body = latestNews; // 찾은 뉴스 1건을 응답
  } catch (e) {
    // 서버 내부 오류처리
    ctx.status = 500;
    ctx.body = e.message;
  }
};

// 특정 뉴스 하나를 수동으로 AI 요약하는 함수
export const aiSummarize = async (ctx) => {
  const { id } = ctx.params; // 요청으로부터 뉴스 ID 가져오기
  try {
    const news = await News.findById(id); // 해당 ID로 데이터베이스에서 뉴스 조회
    if (!news) {
      // 뉴스가 없으면 에러
      ctx.status = 404;
      ctx.body = { message: '해당 뉴스를 찾을 수 없습니다.' };
      return;
    }
    if (!news.content) {
      // 뉴스 컨텐츠가 없다면 에러
      ctx.status = 400;
      ctx.body = { message: '요약할 본문 내용이 DB에 없습니다.' };
      return;
    }
    const text = await aiLib.generateSummary(news.content); // AI 라이브러리를 통해 본문(content)을 요약
    news.summary = text;
    await news.save(); // 생성된 요약을 객체에 담고 DB에 최종 저장
    ctx.body = {
      // 성공시 결과 반환
      message: '성공적으로 요약 및 업데이트되었습니다.',
      data: news,
    };
  } catch (e) {
    // 실패시 500
    console.error(e);
    ctx.status = 500;
    ctx.body = { message: 'AI 요약 중 오류 발생', error: e.message };
  }
};
