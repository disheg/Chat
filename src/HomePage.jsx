import React from 'react';
import PropTypes from 'prop-types';
import Channels from './Channels.jsx';
import Chat from './Chat.jsx';

const HomePage = ({ socket }) => (
  <div className="row h-100 pb-3">
    <Channels socket={socket} />
    <Chat id={1} socket={socket} />
  </div>
);

export default HomePage;

HomePage.propTypes = {
  socket: PropTypes.object,
};
