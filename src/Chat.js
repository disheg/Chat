import React, { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import routes from './routes';
import _ from 'lodash';
import Rollbar from 'rollbar';
import { UserName } from './index';
import { change, newMessage, sending, failed, successful } from './slices/messagesSlice';

const Chat = ({ socket }) => {
  const [rollbar, setNewRollbar] = useState(new Rollbar({
    accessToken: '1be20a201adb442f96b443578df0a781',
    captureUncaught: true,
    captureUnhandledRejections: true,
  }));
  const dispatch = useDispatch();

  const userName = useContext(UserName);

  const currentChannelID = useSelector((state) => state.channels.currentChannelID);
  console.log(currentChannelID)
  const messages = useSelector((state) => state.message.messages);
  const message = useSelector((state) => state.message.value);
  const state = useSelector((state) => state.message.state);

  useEffect(() => {
    socket.on('newMessage', (data) => dispatch(newMessage(data)));
  }, []);

  const handleSubmit = (id, message, user) => {
    return async dispatch => {
      dispatch(sending());
      try {
        await axios.post('', { data: {
          attributes: {
            value: message,
            user: user,
          }
        }});
        dispatch(successful());
      } catch (error) {
        rollbar.info(error)
        dispatch(failed({ error: error.message }));
      }
    }
  };

  const currentMessage = messages.filter(({ channelId }) => parseInt(channelId) === parseInt(currentChannelID));
  const renderMessages = currentMessage.map(({ value, user }) => <div key={_.uniqueId(value)} className="text-break">
    <b>{user}</b>: {value}
  </div>);

  const renderBtn = () => {
    if (state === 'sending') {
      return <button aria-label="submit" type="submit" className="btn btn-primary" disabled >Submit</button>;
    }
    return <button aria-label="submit" type="submit" className="btn btn-primary" >Submit</button>;
  };

  return (
    <div className="col h-100">
      <div className="d-flex flex-column h-100">
        <div id="messages-box" className="chat-messages overflow-auto mb-3">
          {renderMessages}
        </div>
        <div className="mt-auto">
          <form noValidate onSubmit={(e) => {
              e.preventDefault();
              throw new Error('react test error');
              dispatch(handleSubmit(currentChannelID, message, userName));
            }}>
            <div className="from-group">
              <div className="input-group">
                <input name="body" aria-label="body" className="mr-2 form-control" autoFocus={true} value={message} onChange={(e) => dispatch(change(e.target.value))} />
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