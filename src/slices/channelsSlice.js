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
      console.log('currentChannelID Slice', currentChannelId);
      return {
        ...state,
        channels,
        currentChannelId,
        isDataLoaded: true,
      };
    },
    newChannel: (state, action) => {
      const channels = [...state.channels, action.payload];
      return {
        ...state,
        channels,
      };
    },
    renameChannel: (state, action) => {
      const { id } = action.payload;
      console.log('rename Socket', action.payload);
      const newName = action.payload.name;
      const channels = state.channels.map((channel) => {
        console.log('channel id', channel.id);
        if (channel.id === parseInt(id, 10)) {
          return { ...channel, name: newName };
        }
        return channel;
      });
      console.log(channels);
      return {
        ...state,
        channels,
      };
    },
    removeChannel: (state, action) => {
      const { id } = action.payload;
      const channels = state.channels.filter((channel) => channel.id !== parseInt(id, 10));
      return {
        ...state,
        channels,
      };
    },
    changeChannel: (state, action) => {
      const { id } = action.payload;
      return {
        ...state,
        currentChannelId: id,
      };
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
