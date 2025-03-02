// 响应拦截器
export default function addResInterceptor(axiosInstance) {
  // 响应状态检查
  axiosInstance.interceptors.response.use(checkStatus, (error) => {
    return Promise.reject(error);
  });

  // 响应代码检查
  axiosInstance.interceptors.response.use(checkCodes, (error) => {
    return Promise.reject(error);
  });
}

// 响应状态检查
function checkStatus(response) {
  // 判断 HTTP 响应状态是否在 200~299 范围内
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  // 如果不在范围内，抛出错误
  const errorText = codeMessage[response.status] || response.statusText;
  const error = new Error(errorText);
  error.name = response.status;
  error.response = response;
  throw error;
}

// 响应代码检查
function checkCodes(response) {
  const data = response.data;

  // 根据不同的 code 执行不同的操作
  if (data.code === 10002 || data.code === 10004) {
    // 如果 code 为 10002 或 10004，表示登录失效，弹出重新登陆操作
    reLogIn();
} else if (data.code === -1) {
    // 如果 code 为 -1，表示操作失败，弹出提示
    // alert可以是内部项目封装的弹窗提示
    alert({
      text: data.message,
      icon: "info",
      button: "close",
    });
  }

  return response; // 返回原始响应数据
}

// 服务器返回的状态信息
const codeMessage = {
  200: "服务器成功返回请求的数据",
  201: "新建或修改数据成功",
  202: "一个请求已经进入后台排队(异步任务)中",
  204: "删除数据成功",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作",
  401: "用户没有权限(令牌、用户名、密码错误)",
  403: "用户得到授权，但是访问是被禁止的",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作",
  406: "请求的格式不可得",
  410: "请求的资源被永久删除，且不会再得到",
  422: "当创建一个对象时，发生一个验证错误",
  500: "服务器发生错误，请检查服务器",
  502: "网关错误",
  503: "服务不可用，服务器暂时过载或维护",
  504: "网关超时",
};

