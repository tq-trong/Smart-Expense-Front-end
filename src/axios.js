import axios from "axios";

axios.defaults.baseURL = 'http://localhost:8080/smart_expense/';

axios.defaults.headers.common['Authorization'] = 'Bearer ' + sessionStorage.getItem('token');

// Biến để kiểm soát việc refresh token
let isRefreshing = false;
let refreshSubscribers = [];

// Hàm để thêm các request đang chờ token mới
function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

// Hàm để thông báo cho các request đang chờ rằng token đã được làm mới
function onRefreshed(token) {
  refreshSubscribers.map(cb => cb(token));
}

// Interceptor cho request
axios.interceptors.request.use((config) => {
  if (config.url.includes('auth/log-in') || config.url.includes('auth/refresh') || config.url.includes('users/register')) {
    delete config.headers['Authorization'];  
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor cho response
axios.interceptors.response.use((response) => {
  return response;
}, async (error) => {
  const originalRequest = error.config;
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');

  if (!token) {
    window.location.href = '/login';
    return;
  }

  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const { data } = await axios.post('auth/refresh', { token: token });

        // Lưu token mới vào sessionStorage
        sessionStorage.removeItem('token');
        sessionStorage.setItem('token', data.result.token);

        axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.result.token;
        originalRequest.headers['Authorization'] = 'Bearer ' + data.result.token;

        // Gửi lại tất cả request đã chờ token mới
        onRefreshed(data.result.token);
        refreshSubscribers = []; // Reset hàng đợi
        isRefreshing = false;

        return axios(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        window.location.href = '/login';
      }
    } else {
      // Nếu đã có một yêu cầu refresh token đang được thực hiện, chờ nó hoàn tất
      return new Promise((resolve) => {
        subscribeTokenRefresh((token) => {
          // Cập nhật token mới cho request ban đầu và gửi lại
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          resolve(axios(originalRequest));
        });
      });
    }
  }

  return Promise.reject(error);
});
