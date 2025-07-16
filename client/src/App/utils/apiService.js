import axios from "axios";
import { BASE_ADMIN_API_URI } from "./constant";

axios.defaults.baseURL = BASE_ADMIN_API_URI;

axios.interceptors.request.use(config => {
  const authToken = localStorage.getItem("accessToken");
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

axios.interceptors.response.use(
  response => {
    if (
      response.status !== 200 ||
      (Object.hasOwn(response.data || {}, "success") && !response.data.success) ||
      (Object.hasOwn(response.data || {}, "statusCode") && response.data.statusCode !== 200)
    ) {
      throw new Error(response.data?.message);
    }
    return response.data;
  },
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.href = "/";
      return;
    }
    throw new Error(error);
  }
);

export const apiRequest = async ({ method, url, req, params }) => {
  try {
    if (method === "get") return await axios[method](url, params);
    return await axios[method](url, req, params);
  } catch (error) {
    return { error: error.message };
  }
};

export const getApi = async (url, params) => await apiRequest({ method: "get", url, params });
export const postApi = async (url, req, params) => await apiRequest({ method: "post", url, req, params });
export const putApi = async (url, req, params) => await apiRequest({ method: "put", url, req, params });
export const deleteApi = async (url, req, params) => await apiRequest({ method: "delete", url, req, params });
export const patchApi = async (url, req, params) => await apiRequest({ method: "patch", url, req, params });
