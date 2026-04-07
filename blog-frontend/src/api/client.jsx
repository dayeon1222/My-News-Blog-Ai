import axios from 'axios';

const client = axios.create({
  baseURL: 'https://my-news-blog-ai.onrender.com', // 서버 주소
  withCredentials: true,
});

export default client;
