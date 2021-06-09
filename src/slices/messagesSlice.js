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
      const messages = [...state.messages, message];
      return {
        ...state,
        value: '',
        messages,
      };
    },
  },
  extraReducers: {
    [setData](state, action) {
      console.log('setData Message', action);
      const { messages } = action.payload;
      state.isDataLoaded = true;
      return {
        ...state,
        messages,
        isDataLoaded: true,
      };
    },
    [removeChannel](state, action) {
      console.log('remove message', action.payload);
      const { id } = action.payload;
      const messages = state.messages
        .filter(({ channelId }) => parseInt(channelId, 10) !== parseInt(id, 10));
      return {
        ...state,
        messages,
      };
    },
  },
});

export const {
  newMessage,
} = messagesSlice.actions;
export default messagesSlice.reducer;
