import { useSelector } from 'react-redux';

export const channelsStateSelector = useSelector(({ channels }) => channels.state);
export const channelsSelector = useSelector((state) => state.channels.channels);
export const currentChannelIDSelector = useSelector((state) => state.channels.currentChannelID);
