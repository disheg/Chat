import { createSlice, createAction } from '@reduxjs/toolkit';
import gon from 'gon';

export const channelsSlice = createSlice({
  name: 'channels',
  initialState: {
    currentChannelID: '1',
    channels: gon.channels,
    state: '',
  },
  reducers: {
    renameChannel: (state, action) => {
      const id = action.payload.data.id;
      const channel = action.payload.data.attributes;
      const channels = state.channels.filter((channel) => { console.log('channel id', channel.id); return channel.id !== parseInt(id)});
      channels.push(channel);
      state.channels = channels;
    },
    removeChannel: (state, action) => {
      const id = action.payload.data.id;
      const channels = state.channels.filter((channel) => channel.id !== parseInt(id));
      state.channels = channels;
    },
    newChannel: (state, action) => {
      const newChannel = action.payload.data.attributes;
      state.channels.push(newChannel);
    },
    changeChannel: (state, action) => {
      const id = action.payload.id;
      state.currentChannelID = id;
    },
    sending: (state, action) => {
      state.state = 'sending';
    },
    failed: (state, action) => {
      state.state = 'failed';
    },
    successful: (state, action) => {
      state.state = 'successful';
    }
  },
});

export const { renameChannel, removeChannel, newChannel, changeChannel, sending, failed, successful } = channelsSlice.actions;
export default channelsSlice.reducer;