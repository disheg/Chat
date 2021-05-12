import React from 'react';

import App from './src/App.jsx';

export default (socket) => {
  console.log('it works!');
  return <App socket={socket} />;
};