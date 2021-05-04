import { createSlice } from '@reduxjs/toolkit';
import { setData, removeChannel, changeChannel } from './channelsSlice.js';

export const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    value: '',
    messages: [],
    state: '',
  },
  reducers: {
    changeMessage: (state, action) => {
      console.log(state)
      state.value = action.payload;
    },
    newMessage: (state, action) => {
      console.log('action', action)
      const message = action.payload;
      state.value = '';
      state.messages.push(message);
    },
  },
  extraReducers: {
    [setData](state, action) {
      console.log('Message new channel', action);
      state.messages = action.payload.messages;
    },
    [changeChannel](state) {
      state.value = '';
    },
    [removeChannel](state, action) {
      console.log('remove message', action.payload)
      const id = action.payload.id;
      state.messages = state.messages.filter(({ channelId }) => parseInt(channelId) !== parseInt(id));
    },
  },
});

export const { changeMessage, newMessage, sending, failed, successful } = messagesSlice.actions;
export default messagesSlice.reducer;