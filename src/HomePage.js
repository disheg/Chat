import React from 'react';
import PropTypes from 'prop-types';
import Channels from './Channels.js';
import Chat from './Chat.js';

const HomePage = ({ socket }) => {
  return (
    <div className="row h-100 pb-3">
      <Channels socket={socket} />
      <Chat id={1} socket={socket} />
    </div>
  );
};

export default HomePage;

HomePage.propTypes = {
  socket: PropTypes.object,
};