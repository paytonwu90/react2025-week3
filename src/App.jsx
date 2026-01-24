import { useState, useEffect } from 'react'
import axios from 'axios'
import { setCookieToken } from './utils/cookie';
import useAuth from './hooks/useAuth';
import LoginForm from './components/LoginForm'
import ProductList from './components/ProductList'

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  const { isAuth, isAuthLoading, setIsAuth } = useAuth();

  function handleLoginSuccess(token, expired) {
    setCookieToken(token, expired);
    axios.defaults.headers.common['Authorization'] = token;
    setIsAuth(true);
  }

  function handleLoginFailure() {
    setIsAuth(false);
  }
  
  if (isAuthLoading) {
    return <div>載入中...</div>;
  }
  return (
    <>
      {isAuth ? (
        <ProductList />
      ) : (
        <LoginForm 
          onLoginSuccess={handleLoginSuccess}
          onLoginFailure={handleLoginFailure} />
      )}
    </>
  );
}

export default App
