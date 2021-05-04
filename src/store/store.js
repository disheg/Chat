import { configureStore } from '@reduxjs/toolkit';
import messagesSlice from '../slices/messagesSlice.js';
import channelsSlice from '../slices/channelsSlice.js';

export default configureStore({
  reducer: {
    channels: channelsSlice,
    message: messagesSlice,
  },
});