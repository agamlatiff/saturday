import axios from "axios";
import Cookies from "js-cookie"; 

const apiClient = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true, // ✅ Required for Sanctum authentication
  withXSRFToken: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// ✅ Interceptor to Ensure CSRF Token is Sent
apiClient.interceptors.request.use(async (config) => {
  
  // Ensure CSRF token is fetched before login/register
  if (config.url?.includes("/login") || config.url?.includes("/register")) {
    await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
        withCredentials: true,
        withXSRFToken: true,
    });
  }

  // ✅ Read CSRF token from cookie and set it in headers
  const csrfToken = Cookies.get("XSRF-TOKEN");

  if (csrfToken) {
    config.headers["X-XSRF-TOKEN"] = csrfToken;
  }

  // ✅ Don't override Content-Type for FormData (let axios set it automatically)
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

export default apiClient;
