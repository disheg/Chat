import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  ButtonGroup,
  DropdownButton,
  Dropdown,
} from 'react-bootstrap';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';

import CustomModal from './Modal.jsx';
import {
  newChannel,
  renameChannel,
  removeChannel,
  changeChannel,
} from './slices/channelsSlice.js';
import { socketContext } from './contexts/index.js';

const ChannelBtn = ({
  id,
  name,
  currentChannelID,
  removable,
  handleChangeChannel,
  handleRemoveChannel,
  handleChangeChannelName,
}) => {
  const btnColor = parseInt(currentChannelID, 10) === parseInt(id, 10) ? 'primary' : 'light';
  const removableBtnCN = `nav-link text-left flex-grow-1 btn-${btnColor}`;
  const defaultBtnCN = `nav-link btn-block mb-2 text-left btn btn-${btnColor}`;
  if (!removable) {
    return (
      <li key={_.uniqueId(name)} className="nav-item">
        <button type="button" className={defaultBtnCN} onClick={handleChangeChannel(id)}>{name}</button>
      </li>
    );
  }
  return (
    <li key={_.uniqueId(name)} className="nav-item">
      <ButtonGroup className="d-flex dropdown mb-2">
        <Button className={removableBtnCN} onClick={handleChangeChannel(id)}>{name}</Button>
        <DropdownButton as={ButtonGroup} title="" id="bg-nested-dropdown" variant={btnColor}>
          <Dropdown.Item eventKey="1" onClick={handleChangeChannelName(id)}>Change Name</Dropdown.Item>
          <Dropdown.Item eventKey="2" onClick={handleRemoveChannel(id)}>Delete Chanel</Dropdown.Item>
        </DropdownButton>
      </ButtonGroup>
    </li>
  );
};

const Channels = () => {
  console.log('Path Channels', window.location.href);
  const socket = useContext(socketContext);
  const [showModal, setShowModal] = useState(false);
  const [currentModal, setCurrentModal] = useState('');
  const [currentID, setCurrentID] = useState();

  const dispatch = useDispatch();
  const channels = useSelector((state) => state.channels.channels);
  const currentChannelID = useSelector((state) => state.channels.currentChannelID);
  const UIstate = useSelector((state) => state.channels.state);

  useEffect(() => {
    socket.on('newChannel', (data) => dispatch(newChannel(data)));
    socket.on('renameChannel', (data) => dispatch(renameChannel(data)));
    socket.on('removeChannel', (data) => dispatch(removeChannel(data)));
  }, [dispatch, socket]);

  const handleSubmitNewChannel = (channelName) => {
    if (channelName) {
      socket.emit('newChannel', { name: channelName }, (res) => console.log(res));
    }
  };

  const handleSubmitRenameChannel = (id) => (name) => {
    if (name) {
      socket.emit('renameChannel', { id, name }, (res) => console.log('channelRename', res));
    }
  };

  const handleChangeChannelName = (id) => () => {
    setCurrentID(id);
    setCurrentModal('renameChannel');
    setShowModal(true);
  };

  const handleChangeChannel = (id) => () => dispatch(changeChannel({ id }));
  const handleRemoveChannel = (id) => () => socket.emit('removeChannel', { id }, () => {});

  const modal = {
    renameChannel: {
      state: UIstate,
      handleSubmit: handleSubmitRenameChannel(currentID),
      dataTestId: 'rename-channel',
    },
    addChannel: {
      state: UIstate,
      handleSubmit: handleSubmitNewChannel,
      dataTestId: 'add-channel',
    },
  };

  const channelsSort = _.sortBy(channels, ['id']);
  const renderChannels = channelsSort
    .map(({ id, name, removable }) => (
      <ChannelBtn
        key={_.uniqueId(id + name)}
        id={id}
        name={name}
        removable={removable}
        currentChannelID={currentChannelID}
        handleChangeChannel={handleChangeChannel}
        handleRemoveChannel={handleRemoveChannel}
        handleChangeChannelName={handleChangeChannelName}
      />
    ));

  return (
    <>
      <div className="col-3 border-right">
        <div className="d-flex mb-2">
          <span>Channels</span>
          <button
            type="button"
            className="ml-auto p-0 btn btn-link"
            onClick={() => {
              setCurrentModal('addChannel');
              setShowModal(true);
            }}
          >
            +
          </button>
        </div>
        <ul className="nav flex-column nav-pills nav-fill">
          {renderChannels}
        </ul>
      </div>
      {
      showModal
        ? (
          <CustomModal
            setShowModal={setShowModal}
            showModal={showModal}
            state={modal[currentModal].state}
            handleSubmit={modal[currentModal].handleSubmit}
            dataAttribute={modal[currentModal].dataTestId}
          />
        )
        : ''
    }
    </>
  );
};

export default Channels;

ChannelBtn.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  currentChannelID: PropTypes.number.isRequired,
  removable: PropTypes.bool.isRequired,
  handleChangeChannel: PropTypes.func.isRequired,
  handleRemoveChannel: PropTypes.func.isRequired,
  handleChangeChannelName: PropTypes.func.isRequired,
};
