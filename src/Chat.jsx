import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { changeMessage, newMessage } from './slices/messagesSlice.js';

const Chat = ({ socket, userName }) => {
  const dispatch = useDispatch();

  console.log('username', userName);

  const currentChannelID = useSelector((state) => state.channels.currentChannelID);
  console.log('currentChannelID', currentChannelID);
  const messages = useSelector((state) => { console.log('stats', state); return state.message.messages; });
  const message = useSelector((state) => state.message.value);
  const messageState = useSelector((state) => state.message.state);

  console.log('messages', messages);

  useEffect(() => {
    socket.on('newMessage', (data) => dispatch(newMessage(data)));
  }, []);

  const handleChangeMessage = (e) => dispatch(changeMessage(e.target.value));

  const handleSubmit = (channelId, message, user) => (e) => {
    e.preventDefault();
    socket.emit('newMessage', { channelId, message, user }, () => {
      console.log('Message sended');
    });
  };

  const currentMessage = messages.filter(
    ({ channelId }) => parseInt(channelId, 10) === parseInt(currentChannelID, 10),
  );
  const renderMessages = currentMessage.map(({ id, message, user }) => (
    <div key={_.uniqueId(id)} className="text-break">
      <b>{user}</b>
      :
      {message}
    </div>
  ));

  console.log('currentMessage', currentMessage);
  console.log('renderMessages', renderMessages);

  const renderBtn = () => {
    if (messageState === 'sending') {
      return <button aria-label="submit" type="submit" className="btn btn-primary" disabled>Submit</button>;
    }
    return <button aria-label="submit" type="submit" className="btn btn-primary">Submit</button>;
  };

  return (
    <div className="col h-100">
      <div className="d-flex flex-column h-100">
        <div id="messages-box" className="chat-messages overflow-auto mb-3">
          {renderMessages}
        </div>
        <div className="mt-auto">
          <form noValidate onSubmit={handleSubmit(currentChannelID, message, userName)}>
            <div className="from-group">
              <div className="input-group">
                <input name="body" aria-label="body" className="mr-2 form-control" autoFocus={true} value={message} onChange={handleChangeMessage} />
                {renderBtn()}
                <div className="d-block invalid-feedback">&nbsp;</div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;

Chat.propTypes = {
  socket: PropTypes.object,
  userName: PropTypes.string,
};
