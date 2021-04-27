import { configureStore } from '@reduxjs/toolkit';
import messagesSlice from '../slices/messagesSlice';
import channelsSlice from '../slices/channelsSlice';

export default configureStore({
  reducer: {
    channels: channelsSlice,
    message: messagesSlice,
  },
});