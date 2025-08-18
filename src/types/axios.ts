import axios from "axios";

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:6001",
    timeout: 30 * 60 * 1000, // 30 minutes
    headers: {
      "Content-Type": "application/json",
    },
  });

  export default apiClient;