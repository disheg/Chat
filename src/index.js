// @ts-check

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '../assets/application.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import gon from 'gon';
import faker from 'faker';
import Cookies from 'js-cookie';

import App from './App';
import socket from './socket';
import UserName from './UserNameContext';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

const p = document.createElement('p');
p.classList.add('card-text');
p.textContent = 'It works!';

const h5 = document.createElement('h5');
h5.classList.add('card-title');
h5.textContent = 'Project frontend l4 boilerplate';

const cardBody = document.createElement('div');
cardBody.classList.add('card-body');
cardBody.append(h5, p);

const card = document.createElement('div');
card.classList.add('card', 'text-center');
card.append(cardBody);

const container = document.querySelector('#chat');

console.log('it works!');
console.log('gon', gon);

const initialState = { ...gon };
const sock = socket();

const userNameCookies = Cookies.get('userName');
const userName = userNameCookies || Cookies.set('userName', faker.name.findName());

ReactDOM.render(
  <Provider store={store}>
    <UserName.Provider value={userName}>
      <App state={initialState} socket={sock} />
    </UserName.Provider>
  </Provider>,
  container,
);