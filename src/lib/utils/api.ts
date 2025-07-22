import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import type { AstroCookies } from "astro";
import { CONSTANTS, ROUTES } from "./constants";

// Helper function to get cookie value
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

// Set cookie with proper attributes
export const setCookie = (
  name: string,
  value: string,
  maxAgeSeconds = 604800
) => {
  const isProd = import.meta.env.PROD;
  const cookieOptions = [
    `path=/`,
    `max-age=${maxAgeSeconds}`,
    isProd ? "secure" : "",
    "samesite=strict",
  ]
    .filter(Boolean)
    .join("; ");

  document.cookie = `${name}=${value}; ${cookieOptions}`;
};

// Delete cookie
export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

// Export constants for use in other files
export { CONSTANTS };

// Create client-side axios instance
const clientApi = axios.create({
  baseURL: import.meta.env.PUBLIC_API_URL || "https://hotel-booking-backend-qwh4.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Create server-side axios instance
const serverApi = axios.create({
  baseURL: import.meta.env.PUBLIC_API_URL || "https://hotel-booking-backend-qwh4.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Client-side request interceptor
clientApi.interceptors.request.use(
  (config) => {
    const token = getCookie(CONSTANTS.ACCESS_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Client-side response interceptor
clientApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getCookie(CONSTANTS.REFRESH_TOKEN_KEY);
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post(ROUTES.REFRESH_TOKEN_ROUTE, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        setCookie(CONSTANTS.ACCESS_TOKEN_KEY, accessToken);
        setCookie(CONSTANTS.REFRESH_TOKEN_KEY, newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return clientApi(originalRequest);
      } catch (refreshError) {
        deleteCookie(CONSTANTS.ACCESS_TOKEN_KEY);
        deleteCookie(CONSTANTS.REFRESH_TOKEN_KEY);
        window.location.href = "/auth";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Type definitions for common API responses
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Client-side API service
export const apiService = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await clientApi.get(url, config);
      return response.data;
    } catch (error: any) {
      handleApiError(error);
      return error.response?.data || { success: false, message: "Network error" };
    }
  },

  post: async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await clientApi.post(url, data, config);
      return response.data;
    } catch (error: any) {
      handleApiError(error);
      return error.response?.data || { success: false, message: "Network error" };
    }
  },

  put: async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await clientApi.put(url, data, config);
      return response.data;
    } catch (error: any) {
      handleApiError(error);
      return error.response?.data || { success: false, message: "Network error" };
    }
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await clientApi.delete(url, config);
      return response.data;
    } catch (error: any) {
      handleApiError(error);
      return error.response?.data || { success: false, message: "Network error" };
    }
  },

  patch: async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await clientApi.patch(url, data, config);
      return response.data;
    } catch (error: any) {
      handleApiError(error);
      return error.response?.data || { success: false, message: "Network error" };
    }
  },
};

// Helper function to handle API errors
const handleApiError = (error: any) => {
  if (!error.response) {
    // Network error or no response
    error.response = {
      data: {
        success: false,
        message: 'Network error. Please check your connection.',
        status: 0
      }
    };
    return;
  }

  const { status, data } = error.response;

  switch (status) {
    case 400:
      error.response.data = {
        success: false,
        message: data?.message || 'Bad request. Please check your input.',
        status: 400
      };
      break;

    case 401:
      error.response.data = {
        success: false,
        message: data?.message || 'Unauthorized. Please login again.',
        status: 401
      };
      break;

    case 403:
      error.response.data = {
        success: false,
        message: data?.message || 'Forbidden. You do not have permission to perform this action.',
        status: 403
      };
      break;

    case 404:
      error.response.data = {
        success: false,
        message: data?.message || 'Resource not found.',
        status: 404
      };
      break;

    case 413:
      error.response.data = {
        success: false,
        message: data?.message || 'Payload too large. Please reduce the size of your request.',
        status: 413
      };
      break;

    case 422:
      error.response.data = {
        success: false,
        message: data?.message || 'Validation error. Please check your input.',
        status: 422
      };
      break;

    case 429:
      error.response.data = {
        success: false,
        message: data?.message || 'Too many requests. Please try again later.',
        status: 429
      };
      break;

    case 500:
      error.response.data = {
        success: false,
        message: data?.message || 'Internal server error. Please try again later.',
        status: 500
      };
      break;

    default:
      error.response.data = {
        success: false,
        message: data?.message || 'An unexpected error occurred.',
        status: status || 500
      };
  }
};

async function refreshTokenFromCookies(
  cookies: AstroCookies
): Promise<{ accessToken: string; refreshToken: string } | null> {
  const refreshToken = cookies.get(CONSTANTS.REFRESH_TOKEN_KEY)?.value;
  console.log("refreshToken", refreshToken);
  if (!refreshToken) return null;

  try {
    const res: ApiResponse<{ accessToken: string; refreshToken: string }> =
      await serverApiService.post(ROUTES.REFRESH_TOKEN_ROUTE, "", {
        refreshToken,
      });
    console.log("res in refreshTokenFromCookies", res);

    if (res.success) {
      cookies.set(CONSTANTS.ACCESS_TOKEN_KEY, res.data.accessToken, {
        path: "/",
      });
      cookies.set(CONSTANTS.REFRESH_TOKEN_KEY, res.data.refreshToken, {
        path: "/",
      });
      return res.data;
    }
  } catch (e) {
    console.log("error in refreshTokenFromCookies", e);
    // Refresh failed
  }

  return null;
}

// Server-side API service
export const serverApiService = {
  get: async <T>(
    url: string,
    token: string,
    cookies?: AstroCookies,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    try {
      const response = await serverApi.get(url, {
        ...config,
        headers: {
          ...config?.headers,
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.log("error in serverApiService.get", error);
      if (error.response?.status === 401 && cookies) {
        console.log("refreshing token");
        const refreshed = await refreshTokenFromCookies(cookies);
        console.log("refreshed", refreshed);
        if (refreshed) {
          const retryResponse = await serverApi.get(url, {
            ...config,
            headers: {
              ...config?.headers,
              Authorization: `Bearer ${refreshed.accessToken}`,
            },
          });
          return retryResponse.data;
        }
      }
      handleApiError(error);
      return error.response.data;
    }
  },

  post: async <T>(
    url: string,
    token: string,
    data?: any,
    cookies?: AstroCookies,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    try {
      const response = await serverApi.post(url, data, {
        ...config,
        headers: {
          ...config?.headers,
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401 && cookies) {
        const refreshed = await refreshTokenFromCookies(cookies);
        if (refreshed) {
          const retryResponse = await serverApi.post(url, data, {
            ...config,
            headers: {
              ...config?.headers,
              Authorization: `Bearer ${refreshed.accessToken}`,
            },
          });
          return retryResponse.data;
        }
      }
      handleApiError(error);
      return error.response.data;
    }
  },

  put: async <T>(
    url: string,
    token: string,
    data?: any,
    cookies?: AstroCookies,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    try {
      const response = await serverApi.put(url, data, {
        ...config,
        headers: {
          ...config?.headers,
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401 && cookies) {
        const refreshed = await refreshTokenFromCookies(cookies);
        if (refreshed) {
          const retryResponse = await serverApi.put(url, data, {
            ...config,
            headers: {
              ...config?.headers,
              Authorization: `Bearer ${refreshed.accessToken}`,
            },
          });
          return retryResponse.data;
        }
      }
      handleApiError(error);
      return error.response.data;
    }
  },

  delete: async <T>(
    url: string,
    token: string,
    cookies?: AstroCookies,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    try {
      const response = await serverApi.delete(url, {
        ...config,
        headers: {
          ...config?.headers,
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401 && cookies) {
        const refreshed = await refreshTokenFromCookies(cookies);
        if (refreshed) {
          const retryResponse = await serverApi.delete(url, {
            ...config,
            headers: {
              ...config?.headers,
              Authorization: `Bearer ${refreshed.accessToken}`,
            },
          });
          return retryResponse.data;
        }
      }
      handleApiError(error);
      return error.response.data;
    }
  },

  patch: async <T>(
    url: string,
    token: string,
    data?: any,
    cookies?: AstroCookies,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    try {
      const response = await serverApi.patch(url, data, {
        ...config,
        headers: {
          ...config?.headers,
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401 && cookies) {
        const refreshed = await refreshTokenFromCookies(cookies);
        if (refreshed) {
          const retryResponse = await serverApi.patch(url, data, {
            ...config,
            headers: {
              ...config?.headers,
              Authorization: `Bearer ${refreshed.accessToken}`,
            },
          });
          return retryResponse.data;
        }
      }
      handleApiError(error);
      return error.response.data;
    }
  },
};
