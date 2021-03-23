import React from 'react';
import Channels from './Channels';
import Chat from './Chat';

const App = ({ state, socket }) => {
  return <div className="row h-100 pb-3">
    <Channels socket={socket} />
    <Chat id={1} socket={socket} />
  </div>;
};

export default App;