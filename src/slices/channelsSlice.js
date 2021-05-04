import { createSlice } from '@reduxjs/toolkit';

export const channelsSlice = createSlice({
  name: 'channels',
  initialState: {
    currentChannelID: '1',
    channels: [],
  },
  reducers: {
    setData: (state, action) => {
      console.log('getChannels', action.payload)
      const { channels, currentChannelId } = action.payload;
      state.channels = channels;
      console.log('currentChannelID Slice', currentChannelId)
      state.currentChannelID = currentChannelId;
    },
    newChannel: (state, action) => {
      state.channels.push(action.payload);
    },
    renameChannel: (state, action) => {
      const id = action.payload.id;
      console.log('rename Socket', action.payload)
      const newName = action.payload.name;
      const channels = state.channels.map((channel) => {
        console.log('channel id', channel.id);
        if (channel.id === parseInt(id)) {
          channel.name = newName;
        }
        return channel;
      });
      console.log(channels)
      state.channels = channels;
    },
    removeChannel: (state, action) => {
      const id = action.payload.id;
      const channels = state.channels.filter((channel) => channel.id !== parseInt(id));
      state.channels = channels;
    },
    changeChannel: (state, action) => {
      const id = action.payload.id;
      state.currentChannelID = id;
    },
  },
  extraReducers: {

  }
});

export const {
  setData,
  newChannel,
  changeChannel,
  removeChannel,
  renameChannel
} = channelsSlice.actions;
export default channelsSlice.reducer;