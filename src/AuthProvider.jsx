import React, { useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import authContext from './contexts/index.js';

const AuthProvider = ({ children }) => {
  //const userId = JSON.parse(localStorage.getItem('userId'));
  const getToken = () => localStorage.getItem('userId')

  const isLoggedIn = () => _.has(localStorage, 'userId');
  const logIn = (token) => {
    console.log('logIN token', token)
    localStorage.setItem('userId', token); }
  const logOut = () => {
    localStorage.removeItem('userId');
  };

  return (
    <authContext.Provider value={{ isLoggedIn, logIn, logOut }}>
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;

