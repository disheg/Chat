import { createSlice, createAction, createAsyncThunk } from '@reduxjs/toolkit';
import gon from 'gon';
import axios from 'axios';
import routes from '../routes';

export const newChannel = createAsyncThunk(
  'channels/newChannel',
  async (channelName) => {
    const response = await axios.post(routes.channelsPath(), { data: {
      attributes: {
        name: channelName.trim(),
      }
    }});
    console.log(response)
    return response.data;
  }
);

export const renameChannel = createAsyncThunk(
  'channels/renameChannel',
  async (data) => {
    const { id, channelName } = data;
    const response = await axios.patch(routes.channelPath(id), { data: {
      attributes: {
        name: channelName,
      }
    }});
    console.log(response)
    return response.data;
  }
);

export const removeChannel = createAsyncThunk(
  'channels/removeChannel',
  async (id) => {
    const response = await axios.delete(routes.channelPath(id), { data: {
      attributes: {
        id: id,
      }
    }});
    console.log(response)
    return response.data;
  }
);

export const channelsSlice = createSlice({
  name: 'channels',
  initialState: {
    currentChannelID: '1',
    channels: gon.channels,
  },
  reducers: {
    renameChannelSocket: (state, action) => {
      const id = action.payload.data.id;
      console.log('rename Socket', action.payload)
      const channel = action.payload.data.attributes;
      const channels = state.channels.filter((channel) => { console.log('channel id', channel.id); return channel.id !== parseInt(id)});
      channels.push(channel);
      state.channels = channels;
    },
    removeChannelSocket: (state, action) => {
      const id = action.payload.data.id;
      const channels = state.channels.filter((channel) => channel.id !== parseInt(id));
      state.channels = channels;
    },
    newChannelSocket: (state, action) => {
      const newChannel = action.payload.data.attributes;
      state.channels.push(newChannel);
    },
    changeChannel: (state, action) => {
      const id = action.payload.id;
      state.currentChannelID = id;
    },
  },
  extraReducers: {
    [newChannel.fulfilled]: (state, action) => {
      console.log('Channel created', action);
    },
    [newChannel.pending]: (state, action) => {
      console.log('Channel pending', action)
    },
    [newChannel.rejected]: (state, action) => {
      console.log('Channel rejected', action.error.message)
    },
    [renameChannel.fulfilled]: (state, action) => {
      console.log('renameChannel fulfilled', action);
    },
    [renameChannel.pending]: (state, action) => {
      console.log('renameChannel pending', action)
    },
    [renameChannel.rejected]: (state, action) => {
      console.log('renameChannel rejected', action.error.message)
    },
    [removeChannel.fulfilled]: (state, action) => {
      console.log('Channel created', action);
    },
    [removeChannel.pending]: (state, action) => {
      console.log('Channel pending', action)
    },
    [removeChannel.rejected]: (state, action) => {
      console.log('Channel rejected', action.error.message)
    }
  }
});

export const { changeChannel, newChannelSocket, removeChannelSocket, renameChannelSocket } = channelsSlice.actions;
export default channelsSlice.reducer;