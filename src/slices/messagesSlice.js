import { createSlice } from '@reduxjs/toolkit';
import { setData, removeChannel, changeChannel } from './channelsSlice.js';

export const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    value: '',
    messages: [],
    state: '',
    isDataLoaded: false,
  },
  reducers: {
    changeMessage: (state, action) => {
      state.value = action.payload;
    },
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
    [changeChannel](state) {
      state.value = '';
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
  changeMessage,
  newMessage,
  sending,
  failed,
  successful,
} = messagesSlice.actions;
export default messagesSlice.reducer;
