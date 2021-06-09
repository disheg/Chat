import { configureStore } from '@reduxjs/toolkit';
import messagesReducer from '../slices/messagesSlice.js';
import channelsReducer from '../slices/channelsSlice.js';

export default configureStore({
  reducer: {
    channels: channelsReducer,
    message: messagesReducer,
  },
});
