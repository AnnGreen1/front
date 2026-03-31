import axios, { AxiosInstance } from "axios";


const http: AxiosInstance = axios.create({
  timeout: 20000
});

//设置请求的拦截器
http.interceptors.request.use(config => {
    // 在这里，可以配置请求头、token等信息
    return config
}, error => {
    console.log(error);
    return Promise.reject(error)
})

// 响应 - 拦截器
http.interceptors.response.use(
  response => {
    // 200，响应成功，返回后端数据
    return Promise.resolve(response);
  },
  error => {
    console.error("response", error);
    return Promise.reject(error);
  }
);

export default http;
