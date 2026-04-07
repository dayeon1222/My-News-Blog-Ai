import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * [스키마 정의] 커뮤니티 게시글(Post)의 데이터 구조 설계
 */
const PostSchema = new Schema({
  title: {
    type: String,
    required: true, // 제목은 필수! 없으면 DB 저장 거부
  },
  body: String, // 게시글의 상세 본문 내용

  // [작성자 정보] 누가 썼는지 객체 형태로 묶어서 저장 (속도 최적화)
  user: {
    _id: {
      type: mongoose.Types.ObjectId, // 몽고디비 전용 ID 형식
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
  },

  // 관련 뉴스 정보 (사용자가 참고한 뉴스의 제목이나 URL)
  news: {
    type: String,
  },

  // 태그들 (예: ['리뷰', 'IT소식'])
  tags: [String],

  // 작성 시간 (따로 입력하지 않아도 저장하는 순간의 시간이 자동으로 기록됨)
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 설계도를 바탕으로 'Post'라는 이름의 실제 모델(도구)을 만듦
const Post = mongoose.model('Post', PostSchema);

export default Post;
