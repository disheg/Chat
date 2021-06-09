import { createSlice } from '@reduxjs/toolkit';
import { setData, removeChannel } from './channelsSlice.js';

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    value: '',
    messages: [],
    state: '',
    isDataLoaded: false,
  },
  reducers: {
    newMessage: (state, action) => {
      console.log('action', action);
      const message = action.payload;
      state.value = '';
      state.messages.push(message);
    },
  },
  extraReducers: {
    [setData](state, action) {
      console.log('setData Message', action);
      state.messages = action.payload.messages;
      state.isDataLoaded = true;
    },
    [removeChannel](state, action) {
      console.log('remove message', action.payload);
      const { id } = action.payload;
      state.messages = state.messages
        .filter(({ channelId }) => parseInt(channelId, 10) !== parseInt(id, 10));
    },
  },
});

export const {
  newMessage,
} = messagesSlice.actions;
export default messagesSlice.reducer;
