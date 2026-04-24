import axios from "axios";

// ===============================
// 🌐 BASE URL (ENV SUPPORT)
// ===============================
const BASE_URL = import.meta.env.VITE_API_URL;
console.log("ENV:", import.meta.env.VITE_API_URL);
// ===============================
// 🔥 AXIOS INSTANCE
// ===============================
const API = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// ===============================
// 🔐 REQUEST INTERCEPTOR
// ===============================
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("optima_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ FIX: Don't override FormData (for image upload)
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ===============================
// 🚨 RESPONSE INTERCEPTOR
// ===============================
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    console.error("API ERROR:", error.response || error.message);

    // 🔥 HANDLE AUTH ERROR
    if (status === 401) {
      localStorage.removeItem("optima_token");

      if (window.location.pathname.includes("/admin")) {
        window.location.href = "/admin/login";
      }
    }

    // 🔥 HANDLE SERVER ERROR
    if (status === 500) {
      alert("Server error. Please try again later.");
    }

    return Promise.reject(error);
  }
);

// ===============================
// 📦 CLEAN RESPONSE HANDLER
// ===============================
const handleResponse = (promise) =>
  promise
    .then((res) => res.data)
    .catch((err) => {
      throw err.response?.data || err;
    });

// ===============================
// 📦 API METHODS
// ===============================
const api = {
  get: (url, config) => handleResponse(API.get(url, config)),

  post: (url, data, config) =>
    handleResponse(API.post(url, data, config)),

  put: (url, data, config) =>
    handleResponse(API.put(url, data, config)),

  patch: (url, data, config) =>
    handleResponse(API.patch(url, data, config)),

  delete: (url, config) =>
    handleResponse(API.delete(url, config)),
};

// ===============================
// 📤 EXPORT
// ===============================
export default api;
export { API };