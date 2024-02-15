import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh_token'));
  const [user, setUser] = useState(null);
  const baseURL = process.env.REACT_APP_API_BASE_URL

  const handleTokenRefresh = async () => {
    try {
      const response = await fetch(`${baseURL}/api/v1/accounts/api/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh: refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const { access, refresh } = await response.json();
      setAccessToken(access);
      setRefreshToken(refresh);
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

    } catch (error) {
      console.error('Token refresh failed', error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await fetch(`${baseURL}/api/v1/accounts/admin/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Request failed');
      }
      const userData = await response.json();
      console.log('uerdata is', userData)
      if (userData.is_superuser) {
        setUser(userData);
      } else {
        console.log('not superuser')
        
      }

    } catch (error) {
      if (error.status === 401) {
        await handleTokenRefresh();
        await fetchUser();
      }
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchUser();
    }
  }, [accessToken]);

  return (
    <AuthContext.Provider value={user}>
      {children}
    </AuthContext.Provider>
  );
};
