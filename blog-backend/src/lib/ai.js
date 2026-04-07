import { GoogleGenerativeAI } from '@google/generative-ai';

// 환경변수(.env)에서 API 키를 가져와 AI 객체 생성
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * 뉴스 본문을 받아 한국어 3문장으로 요약하는 함수
 */
export const generateSummary = async (content) => {
  // 사용할 AI 모델 설정 (Gemini 2.5 Flash 사용)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  // AI에게 내리는 세부 지시사항 (프롬프트 엔지니어링)
  const prompt = `
    Role: 너는 IT 뉴스 전문 한국어 요약가야.
    Task: 아래 제공된 내용을 읽고 반드시 '한국어'로만 3문장 요약해줘.
    Constraint: 
    1. 답변에 영어를 절대 포함하지 마(IT 용어 제외).
    2. 무조건 한국어 완성형 문장으로 끝낼 것.
    
    내용: ${content}
    
    한국어 요약 결과:
  `;

  try {
    //  AI에게 요청을 보내고 응답 텍스트를 추출
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 앞뒤 공백을 제거한 최종 요약본 반환
    return text.trim();
  } catch (error) {
    // [에러 처리] API 키 문제, 네트워크 오류 등을 기록함
    console.error('AI 요약 생성 중 오류:', error);
    throw error;
  }
};
