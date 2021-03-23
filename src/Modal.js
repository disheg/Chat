import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const CustomModal = ({ setShowModal, showModal, state, handleSubmit }) => {
  console.log('showModal', showModal)
  const [value, setValue] = useState('');
  const handleChange = (e) => setValue(e.target.value);
  const handleCloseModal = () => setShowModal(false);

  const renderBtn = () => {
    if (state === 'sending') {
      return (<Button variant="primary" disabled onClick={() => {
        console.log('modal sending 1')
        handleSubmit(value);
        setShowModal(false);
      }}>Save Changes</Button>);
    }
    return (<Button variant="primary" onClick={() => {
      console.log('modal sending 2')
      handleSubmit(value);
      setShowModal(false);
    }}>Save Changes</Button>);
  };

  return (<Modal show={showModal} onHide={handleCloseModal}>
    <Modal.Header closeButton>
      <Modal.Title>Modal heading</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <input name="name" className="mb-2 form-control" value={value} onChange={handleChange}/>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleCloseModal}>
        Close
      </Button>
      {renderBtn()}
    </Modal.Footer>
  </Modal>);
};

export default CustomModal;