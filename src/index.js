// @ts-check

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom'; 
import '../assets/application.scss';

import gon from 'gon';

import App from './App';

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

ReactDOM.render(
  <App state={initialState} />,
  container,
);