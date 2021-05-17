import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { changeMessage, newMessage } from './slices/messagesSlice.js';
import Header from './Header.jsx';

const MessageInput = ({ socket, channelId, userName }) => {
  const dispatch = useDispatch();

  const message = useSelector((state) => state.message.value);
  const messageState = useSelector((state) => state.message.state);

  const handleChangeMessage = (e) => dispatch(changeMessage(e.target.value));
  const handleSubmit = (currentChannelID, message, user) => (e) => {
    e.preventDefault();
    socket.emit('newMessage', { channelId : currentChannelID, message, user }, () => {
      console.log('Message sended');
    });
  };
  const renderBtn = () => {
    if (messageState === 'sending') {
      return <button type="submit" role="button" aria-name="Отправить" aria-label="submit" className="btn btn-primary" disabled>Отправить</button>;
    }
    return <button type="submit" role="button" aria-name="Отправить" aria-label="submit" className="btn btn-primary">Отправить</button>;
  };

  return (
    <form noValidate onSubmit={handleSubmit(channelId, message, userName)}>
      <div className="from-group">
        <div className="input-group">
          <input
            name="body"
            aria-label="body"
            className="mr-2 form-control"
            data-testid="new-message"
            autoFocus={true}
            value={message}
            onChange={handleChangeMessage}
          />
          {renderBtn()}
          <div className="d-block invalid-feedback">&nbsp;</div>
        </div>
      </div>
    </form>
  );
};

const Chat = ({ socket, userName }) => {
  console.log('Path', window.location.href)
  const dispatch = useDispatch();

  console.log('username', userName);

  const currentChannelID = useSelector((state) => state.channels.currentChannelID);
  console.log('currentChannelID', currentChannelID);
  const messages = useSelector((state) => { console.log('stats', state); return state.message.messages; });

  console.log('messages', messages);

  useEffect(() => {
    socket.on('newMessage', (data) => dispatch(newMessage(data)));
  }, []);

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

  return (<>
    <div className="col h-100">
      <div className="d-flex flex-column h-100">
        <div id="messages-box" className="chat-messages overflow-auto mb-3">
          {renderMessages}
        </div>
        <div className="mt-auto">
          <MessageInput channelId={currentChannelID} userName={userName} socket={socket} />
        </div>
      </div>
    </div>
    </>
  );
};

export default Chat;

Chat.propTypes = {
  socket: PropTypes.object,
  userName: PropTypes.string,
};
