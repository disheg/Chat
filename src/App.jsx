import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './store/store.js';
import AuthProvider from './AuthProvider.jsx';
import useAuth from './hooks/index.js';
import Channels from './Channels.jsx';
import Chat from './Chat.jsx';
import Login from './Login.jsx';
import Header from './Header.jsx';
import getAuthHeader from './utils.js';
import { setData } from './slices/channelsSlice.js';
import Registration from './Registration.jsx';

const HomePage = ({ socket }) => {
  console.log('Path HomePage', window.location.href);
  const dispatch = useDispatch();
  const isDataLoaded = useSelector((state) => state.channels.isDataLoaded);
  const userId = JSON.parse(localStorage.getItem('userId'));
  useEffect(() => {
    axios.get('/api/v1/data', { headers: getAuthHeader() })
      .then((data) => {
        console.log('new AXIOS ', data);
        dispatch(setData(data.data));
      });
  }, []);

  if (!isDataLoaded) {
    return <div>Loading...</div>;
  }
  return (
    <div className="row h-100 pb-3">
      <Channels socket={socket} />
      <Chat id={1} socket={socket} userName={userId.username} />
    </div>
  );
};

const Body = ({ socket }) => {
  const auth = useAuth();
  return (
    <Router>
            <Switch>
              <Route exact path="/" render={({ location }) => auth.loggedIn
                ? (
                  <HomePage socket={socket} />
                ) : (
                  <Redirect to={{ pathname: '/login', state: { from: location } }} />
                )} />
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/signup">
                <Registration />
              </Route>
              <Route path="*">
                <div>404 ERROR</div>
              </Route>
            </Switch>
          </Router>
  );
};

const App = ({ socket }) => {
  return (
    <>
      <Provider store={store}>
        <AuthProvider>
          <Header />
          <Body socket={socket} />
        </AuthProvider>
      </Provider>
    </>
  );
};

export default App;

App.propTypes = {
  socket: PropTypes.object,
};

HomePage.propTypes = {
  socket: PropTypes.object,
};
