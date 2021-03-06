import React, { useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { Button } from 'react-bootstrap';
import * as yup from 'yup';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { newMessage } from './slices/messagesSlice.js';
import { socketContext } from './contexts/index.js';

const MessageInput = ({ channelId, userName }) => {
  const socket = useContext(socketContext);
  const formik = useFormik({
    initialValues: {
      body: '',
    },
    validationSchema: yup.object().shape({
      body: yup.string().required(),
    }),
    validateOnBlur: false,
    onSubmit: ({ body }, { resetForm }) => {
      const message = {
        user: userName,
        message: body,
        channelId,
      };
      socket.emit('newMessage', message, () => {
        resetForm();
        console.log('Message sended');
      });
    },
  });

  return (
    <form noValidate onSubmit={formik.handleSubmit} onChange={formik.handleChange}>
      <div className="from-group">
        <div className="input-group">
          <input
            id="body"
            name="body"
            aria-label="body"
            className="mr-2 form-control"
            data-testid="new-message"
            value={formik.values.body}
            onChange={formik.handleChange}
          />
          <Button type="submit" variant="primary" disabled={formik.isSubmitting}>Отправить</Button>
          <div className="d-block invalid-feedback">&nbsp;</div>
        </div>
      </div>
    </form>
  );
};

const Chat = ({ userName }) => {
  console.log('Path', window.location.href);
  const socket = useContext(socketContext);
  const dispatch = useDispatch();

  console.log('username', userName);

  const currentChannelID = useSelector((state) => state.channels.currentChannelID);
  console.log('currentChannelID', currentChannelID);
  const messages = useSelector((state) => { console.log('stats', state); return state.message.messages; });

  console.log('messages', messages);

  useEffect(() => {
    socket.on('newMessage', (data) => dispatch(newMessage(data)));
  }, [dispatch, socket]);

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

  return (
    <>
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
  userName: PropTypes.string.isRequired,
};
