import React from 'react';
import useAuth from './hooks/index.js';

const Header = () => {
  const auth = useAuth();
  return (
    <nav className="mb-3 navbar navbar-expand-lg navbar-light bg-light">
      <a className="mr-auto navbar-brand" href="/">Hexlet Chat</a>
      {
        auth.loggedIn
          ? <button type="button" className="btn btn-primary" onClick={() => auth.logOut()}>Выйти</button>
          : ''
      }
    </nav>
  );
};

export default Header;
