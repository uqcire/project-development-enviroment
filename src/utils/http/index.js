import axios from 'axios';
import qs from 'qs';
import addReqInterceptor from './reqInterceptor';
import addResInterceptor from './resInterceptor';


// 创建 axios 实例
const instance = axios.create({
  baseURL: process.env.$baseUrl, // 在环境变量中设置基础的请求 URL
  timeout: 1000 * 60,  // 设置请求超时时间，单位是毫秒
  withCredentials: true, // 跨域请求时是否需要携带 cookie
  paramsSerializer: function (params) {
    // 使用 qs 库对请求参数进行序列化，支持数组格式化
    return qs.stringify(params, { arrayFormat: 'indices' });
  },
});

// 添加请求拦截器
addReqInterceptor(instance);

// 添加响应拦截器
addResInterceptor(instance);

export default instance;

