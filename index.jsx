import React from 'react';

import App from './src/App.jsx';
import { socketContext } from './src/contexts/index.js';

const init = (socket) => {
  console.log('it works!');
  return (
    <socketContext.Provider value={socket}>
      <App socket={socket} />
    </socketContext.Provider>
  );
};

export default init;
