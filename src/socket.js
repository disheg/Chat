import io from 'socket.io-client';

export default () => {
  const socket = io();
  console.log(socket.on());
  return socket;
};
