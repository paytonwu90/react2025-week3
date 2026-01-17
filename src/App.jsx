import { useState, useEffect } from 'react'
import axios from 'axios'
import LoginForm from './components/LoginForm'
import Products from './components/Products'

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function setCookieToken(token, expired) {
  document.cookie = `hexToken=${token};expires=${new Date(expired).toUTCString()}`;
}

function getCookieToken() {
  return document.cookie
  .split("; ")
  .find((row) => row.startsWith("hexToken="))
  ?.split("=")[1];
}



function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    checkLogin();
  }, []);

  useEffect(() => {
    if (isAuth) {
      getProducts();
    }
  }, [isAuth]);

  async function checkLogin() {
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
    setIsLoading(false);
  }

  function handleLoginSuccess(token, expired) {
    setCookieToken(token, expired);
    // 修改實體建立時所指派的預設配置
    axios.defaults.headers.common['Authorization'] = token;
    setIsAuth(true);
    getProducts();
  }

  function handleLoginFailure() {
    setIsAuth(false);
  }

  async function getProducts() {
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products`);
      setProducts(response.data.products);
    } catch (error) {
      console.error(error);
    }
  }
  
  if (isLoading) {
    return <div>載入中...</div>;
  }
  return (
    <>
      {isAuth ? (
        <Products products={products} />
      ) : (
        <LoginForm 
          onLoginSuccess={handleLoginSuccess}
          onLoginFailure={handleLoginFailure} />
      )}
    </>
  );
}

export default App


