import React from 'react';

import App from './src/App.js';

export default (socket) => {
  console.log('it works!');
  const sock = socket();
  
  return <App socket={sock} />;
};