// @ts-check

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import '../assets/application.scss';

import socket from './socket.js';
import init from './init.js';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

init(socket);