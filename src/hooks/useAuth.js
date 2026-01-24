import { useState, useEffect } from "react";
import axios from "axios";
import { getCookieToken } from "../utils/cookie";

const API_BASE = import.meta.env.VITE_API_BASE;

function useAuth() {
  const [isAuth, setIsAuth] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    const token = getCookieToken();
    if (token) {
      try {
        axios.defaults.headers.common['Authorization'] = token;
        //將 token 送到後端檢查
        const response = await axios.post(`${API_BASE}/api/user/check`);
        if (response.data.success) {
          setIsAuth(true);
        }
      } catch (error) {
        console.error(error.response?.data);
        setIsAuth(false);
      }
    }
    else {
      setIsAuth(false);
    }
    setIsAuthLoading(false);
  }

  return {
    isAuth,
    isAuthLoading,
    setIsAuth,
  };
}

export default useAuth;