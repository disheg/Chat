import React, { useEffect } from 'react';
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

const HomePage = () => {
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
    <>
      <Header />
      <div className="row h-100 pb-3">
        <Channels />
        <Chat id={1} userName={userId.username} />
      </div>
    </>
  );
};

const Body = () => {
  const auth = useAuth();
  return (
    <Switch>
      <Route
        exact
        path="/"
        render={({ location }) => (auth.isLoggedIn()
          ? (
            <HomePage />
          ) : (
            <Redirect to={{ pathname: '/login', state: { from: location } }} />
          ))}
      />
      <Route path="/login" render={() => <Login />} />
      <Route path="/signup" render={() => <Registration />} />
      <Route path="*" render={() => <div>404 ERROR</div>} />
    </Switch>
  );
};

const App = () => (
  <Provider store={store}>
    <AuthProvider>
      <Router>
        <Body />
      </Router>
    </AuthProvider>
  </Provider>
);

export default App;
