import axios from "axios";
import { getToken } from "./auth"; // 假设有一个获取 token 的方法

// 请求拦截器
export default function addReqInterceptor(axiosInstance) {
  axiosInstance.interceptors.request.use(
    (options) => {
      // 在 header 上携带 token
      addRequestToken(options);

      // 添加取消请求的配置项
      addCancelToken(options);

      return options;
    },
    (error) => {
      // 请求错误的处理
      console.warn(`Request interceptor error: ${error}`);
      return Promise.reject(error);
    }
  );
}

// 添加 Token 到请求头
function addRequestToken(options) {
  let tokenMsg = getToken(); // 获取 token
  if (tokenMsg) {
    tokenMsg = JSON.parse(tokenMsg);
    if (tokenMsg.token && tokenMsg.token !== "undefined") {
      // 将 token 放到请求头
      options.headers.token = tokenMsg.token;
    }
  }
}

// 取消请求
const source = {}; // 用于存储取消的请求
function addCancelToken(options) {
  const url = options.url; // 请求地址
  if (options.useCancel) {
    // 如果需要取消请求
    if (source[url]) {
      source[url].cancel(); // 取消之前的请求
    }
    // 获取一个CancelToken对象
    const CancelToken = axios.CancelToken;
    // source()将返回一个能取消请求的方法
    source[url] = CancelToken.source();
    options.cancelToken = source[url].token;
  }
}
