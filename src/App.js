import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import axios from 'axios';
import PropTypes from 'prop-types';

import { Provider, useDispatch } from 'react-redux';
import store from './store/store.js';
import AuthProvider from './AuthProvider.js';
import useAuth from './hooks/index.js';
import Channels from './Channels.js';
import Chat from './Chat.js';
import Login from './Login.js';
import Header from './Header.js';
import { getAuthHeader } from './utils.js';
import { setData } from './slices/channelsSlice.js';
import Registration from './Registration.js';

const PrivateRoute = ({ children, path }) => {
  const auth = useAuth();
  const userId = JSON.parse(localStorage.getItem('userId'));
  useEffect(() => {
    if (userId && userId.token) {
      auth.logIn();
    }
  })
  console.log('PrivateRoute', 'auth', auth)
  return (
    <Route
      path={path}
      render={({ location }) => (auth.loggedIn
        ? children
        : <Redirect to={{ pathname: '/login', state: { from: location } }} />)}
    />
  );
};

const HomePage = ({ socket }) => {
  const dispatch = useDispatch();
  const userId = JSON.parse(localStorage.getItem('userId'));
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  console.log('HomePage', localStorage)
  console.log('check', userId && userId.token)
  useEffect(() => {
    axios.get('/api/v1/data', { headers: getAuthHeader()})
      .then((data) => {
        console.log('new axios ', data);
        dispatch(setData(data.data));
        setIsDataLoaded(true);
      })
  }, []);
  if (!userId || !userId.token) {
    return <Redirect to="/" />;
  }

  if (!isDataLoaded) {
    return <div>Loading...</div>
  }
  return (
    <div className="row h-100 pb-3">
        <Channels socket={socket} />
        <Chat id={1} socket={socket} userName={userId.username} />
    </div>
  );
};

const App = ({ socket }) => {
  return (
    <Provider store={store}>
    <AuthProvider>
      <Header />
      <Router>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/signup">
            <Registration />
          </Route>
          <PrivateRoute path="/">
            <HomePage socket={socket} />
            </PrivateRoute>
          <Route path="*">
            <div>404 ERROR</div>
          </Route>
        </Switch>
      </Router>
    </AuthProvider>
    </Provider>
  );
};

export default App;

App.propTypes = {
  socket: PropTypes.object,
};

HomePage.propTypes = {
  socket: PropTypes.object,
};

PrivateRoute.propTypes = {
  children: PropTypes.object,
  path: PropTypes.string,
};