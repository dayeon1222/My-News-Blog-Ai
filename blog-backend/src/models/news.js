import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * [스키마 정의] 뉴스 데이터의 구조를 설계함
 */
const NewsSchema = new Schema({
  title: String, // 뉴스 제목 (문자열)
  content: String, // 뉴스 본문 (문자열)
  summary: String, // AI가 요약한 내용 (문자열)
  url: String, // 원본 뉴스 링크 주소
  imageUrl: String, // 뉴스 대표 이미지 주소
  publishedAt: Date, // 뉴스 발행일 (날짜 형식)
  tags: [String], // 관련 태그들 (문자열의 배열, 예: ['IT', 'AI'])
});

// 설계도(Schema)를 바탕으로 실제 데이터를 주고받을 수 있는 모델(Model) 생성
const News = mongoose.model('News', NewsSchema);

export default News;
