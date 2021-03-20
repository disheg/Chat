import React from 'react';
import Channels from './Channels';

const App = ({ state }) => {
  return <div className="row h-100 pb-3">
    <Channels channels={state.channels} />
  </div>;
};

export default App;