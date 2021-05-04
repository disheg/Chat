import React from 'react';

import App from './src/App.js';

export default (socket) => {
  console.log('it works!');
  
  return <App socket={socket} />;
};