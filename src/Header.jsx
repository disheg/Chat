import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import useAuth from './hooks/index.js';
import authContext from './contexts/index.js';

const Header = () => {
  const auth = useContext(authContext);
  const history = useHistory();
  const redirectToHome = (e) => {
    e.preventDefault();
    history.push('/');
  };
  console.log('HEADER auth.isLoggedIn()', auth)
  return (
    <nav className="mb-3 navbar navbar-expand-lg navbar-light bg-light">
      <a className="mr-auto navbar-brand" href="/" onClick={redirectToHome}>Hexlet Chat</a>
      {
        auth.isLoggedIn()
          ? <button type="button" className="btn btn-primary" onClick={() => { auth.logOut(); history.push('/'); } }>Выйти</button>
          : ''
      }
    </nav>
  );
};

export default Header;
