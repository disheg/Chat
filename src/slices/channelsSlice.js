import { createSlice } from '@reduxjs/toolkit';

const channelsSlice = createSlice({
  name: 'channels',
  initialState: {
    currentChannelID: '1',
    channels: [],
    isDataLoaded: false,
  },
  reducers: {
    setData: (state, action) => {
      console.log('getChannels', action.payload);
      const { channels, currentChannelId } = action.payload;
      state.channels = channels;
      console.log('currentChannelID Slice', currentChannelId);
      state.currentChannelID = currentChannelId;
      state.isDataLoaded = true;
    },
    newChannel: (state, action) => {
      state.channels.push(action.payload);
    },
    renameChannel: (state, action) => {
      const { id } = action.payload;
      console.log('rename Socket', action.payload);
      const newName = action.payload.name;
      const currentChannel = state.channels.find((channel) => channel.id === id);
      currentChannel.name = newName;
    },
    removeChannel: (state, action) => {
      const { id } = action.payload;
      const channels = state.channels.filter((channel) => channel.id !== parseInt(id, 10));
      state.channels = channels;
    },
    changeChannel: (state, action) => {
      const { id } = action.payload;
      state.currentChannelID = id;
    },
  },
  extraReducers: {

  },
});

export const {
  setData,
  newChannel,
  changeChannel,
  removeChannel,
  renameChannel,
} = channelsSlice.actions;
export default channelsSlice.reducer;
