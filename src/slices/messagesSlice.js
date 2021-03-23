import { createSlice } from '@reduxjs/toolkit';
import gon from 'gon';
import { removeChannel } from './channelsSlice';

export const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    value: '',
    messages: gon.messages,
    state: '',
  },
  reducers: {
    change: (state, action) => {
      console.log(state)
      state.value = action.payload;
    },
    newMessage: (state, action) => {
      const message = action.payload.data.attributes;
      state.messages.push(message);
    },
    sending: (state, action) => {
      state.state = 'sending';
    },
    failed: (state, action) => {
      state.state = 'failed';
    },
    successful: (state, action) => {
      state.value = '';
      state.state = 'successful';
    }
  },
  extraReducers: {
    [removeChannel](state, action) {
      console.log('remove message', action.payload)
      const id = action.payload.data.id;
      state.messages = state.messages.filter(({ channelId }) => parseInt(channelId) !== parseInt(id));
    },
  },
});

export const { change, newMessage, sending, failed, successful } = messagesSlice.actions;
export default messagesSlice.reducer;