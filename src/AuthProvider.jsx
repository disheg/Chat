import React from 'react';
import _ from 'lodash';

import { authContext } from './contexts/index.js';

const AuthProvider = ({ children }) => {
  const getToken = () => localStorage.getItem('userId');

  const isLoggedIn = () => _.has(localStorage, 'userId');
  const logIn = (token) => localStorage.setItem('userId', token);
  const logOut = () => {
    localStorage.removeItem('userId');
  };

  return (
    <authContext.Provider value={{
      isLoggedIn,
      logIn,
      logOut,
      getToken,
    }}
    >
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;
