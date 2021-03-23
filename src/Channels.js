import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, ButtonGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import CustomModal from './Modal';
import { changeChannel } from './slices/channelsSlice';
import routes from './routes';
import { newChannel, renameChannel, removeChannel, sending, failed, successful } from './slices/channelsSlice';

const submitNewChannel = (channelName) => {
  return async dispatch => {
    dispatch(sending());
    try {
      await axios.post(routes.channelsPath(), { data: {
        attributes: {
          name: channelName.trim(),
        }
      }});
      setShowModal(false);
      dispatch(successful());
    } catch (error) {
      dispatch(failed({ error: error.message }));
    }
  }
};

const handleRenameChannel = (id, channelName) => {
  return async dispatch => {
    dispatch(sending());
    try {
      await axios.patch(routes.channelPath(id), { data: {
        attributes: {
          name: channelName,
        }
      }});
      dispatch(successful());
    } catch (error) {
      dispatch(failed({ error: error.message }));
    }
  }
};

const handleRemoveChannel = (id) => {
  return async dispatch => {
    dispatch(sending());
    try {
      await axios.delete(routes.channelPath(id), { data: {
        attributes: {
          id: id,
        }
      }});
      dispatch(successful());
    } catch (error) {
      dispatch(failed({ error: error.message }));
    }
  }
};

const Channels = ({ socket }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentModal, setCurrentModal] = useState('');
  const [currentID, setCurrentID] = useState();

  const dispatch = useDispatch();
  const channels = useSelector((state) => state.channels.channels);
  const currentChannelID = useSelector((state) => state.channels.currentChannelID);
  const state = useSelector((state) => state.channels.state);

  useEffect(() => {
    socket.on('newChannel', (data) => dispatch(newChannel(data)));
    socket.on('renameChannel', (data) => dispatch(renameChannel(data)));
    socket.on('removeChannel', (data) => dispatch(removeChannel(data)));
  }, []);

  const handleSubmitNewChannel = (channelName) => {
    if (channelName) {
      dispatch(submitNewChannel(channelName));
    }
  };

  const handleSubmitRenameChannel = (id) => (channelName) => {
    console.log('handleSubmitRenameChannel', id)
    if (channelName) {
      dispatch(handleRenameChannel(id, channelName));
    }
  };

  const modal = {
    renameChannel: {
      state: state,
      handleSubmit: handleSubmitRenameChannel(currentID),
    },
    addChannel: {
      state: state,
      handleSubmit: handleSubmitNewChannel,
    }
  };

  const handleClick = (id) => (e) => {
    setCurrentID(id);
    setCurrentModal('renameChannel');
    setShowModal(true);
  };


  console.log("channelsSort before", channels)
  const channelsSort = _.sortBy(channels, ['id']);
  console.log("channelsSort after", channelsSort)
  const renderChannels = channelsSort.map(({ id, name, removable }) => {
    const btnColor = parseInt(currentChannelID) === parseInt(id) ? 'primary' : 'light';
    const removableBtnCN = "nav-link text-left flex-grow-1 btn-" + btnColor;
    const defaultBtnCN = "nav-link btn-block mb-2 text-left btn btn-" + btnColor;
    if (!removable) {
      return (
        <li key={_.uniqueId(name)} className="nav-item">
          <button className={defaultBtnCN} onClick={() => dispatch(changeChannel({ id: id }))}>{name}</button>
        </li>
      );
    }
    return (
      <li key={_.uniqueId(name)} className="nav-item">
        <ButtonGroup className="d-flex dropdown mb-2">
          <Button className={removableBtnCN} onClick={() => dispatch(changeChannel({ id: id }))}>{name}</Button>
          <DropdownButton as={ButtonGroup} title="" id="bg-nested-dropdown" variant={btnColor}>
            <Dropdown.Item eventKey="1" onClick={handleClick(id)}>Change Name</Dropdown.Item>
            <Dropdown.Item eventKey="2" onClick={() => dispatch(handleRemoveChannel(id))}>Delete Chanel</Dropdown.Item>
          </DropdownButton>
        </ButtonGroup>
      </li>
    );
    });

  return (
    <>
    <div className="col-3 border-right">
      <div className="d-flex mb-2">
        <span>Channels</span>
        <button type="button" className="ml-auto p-0 btn btn-link" onClick={() => {
            setCurrentModal('addChannel');
            setShowModal(true);
          }
        }>+</button>
      </div>
      <ul className="nav flex-column nav-pills nav-fill">
        {renderChannels}
      </ul>
    </div>
    {showModal ? <CustomModal setShowModal={setShowModal} showModal={showModal} state={modal[currentModal].state} handleSubmit={modal[currentModal].handleSubmit}/> : ''}
    </>
  );
};

export default Channels;