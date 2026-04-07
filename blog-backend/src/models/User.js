import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * [사용자 스키마] 아이디와 암호화된 비밀번호 저장
 */
const UserSchema = new Schema({
  username: String,
  hashedPassword: String, // 비밀번호는 원문 그대로 저장하지 않고 암호화해서 저장
});

// [메서드] 비밀번호 암호화 (회원가입 시 사용)
UserSchema.methods.setPassword = async function (password) {
  // bcrypt를 이용해 비밀번호를 10번 꼬아서 해시값으로 변환
  const hash = await bcrypt.hash(password, 10);
  this.hashedPassword = hash;
};

// [메서드] 비밀번호 확인 (로그인 시 사용)
UserSchema.methods.checkPassword = async function (password) {
  // 입력된 비밀번호와 DB의 해시값을 비교
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result;
};

// [정적 메서드] 아이디로 유저 찾기
UserSchema.statics.findByUsername = function (username) {
  return this.findOne({ username });
};

// [메서드] 데이터 정화 (비밀번호 제외)
UserSchema.methods.serialize = function () {
  const data = this.toJSON();
  delete data.hashedPassword; // 응답 보낼 때 비밀번호 정보는 삭제하여 보안 유지
  return data;
};

// [메서드] 로그인 토큰(JWT) 발행
UserSchema.methods.generateToken = function () {
  const token = jwt.sign(
    {
      _id: this.id,
      username: this.username,
    },
    process.env.JWT_SECRET, // 우리 서버만의 비밀 키
    {
      expiresIn: '7d', // 7일 동안 유효
    },
  );
  return token;
};

const User = mongoose.model('User', UserSchema);
export default User;
