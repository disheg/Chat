import React from 'react';
import ReactDOM from 'react-dom';

import App from './App.js';

export default (socket) => {
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
  const sock = socket();
  
  ReactDOM.render(
    <App socket={sock} />,
    container,
  );
};