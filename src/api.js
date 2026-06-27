import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001", // بدّلها بالسيرفر نتاعك
});

export default api;
