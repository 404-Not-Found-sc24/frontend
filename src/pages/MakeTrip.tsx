import * as React from 'react';
import { useState } from 'react';
import Modal from '../components/modal';

const MakeTrip: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);

    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };

    return (
        <div>
            <button onClick={toggleModal}>Open Modal</button>
            {modalOpen && (
                <Modal onClose={toggleModal}>
                    <h2>Modal Content</h2>
                    <p>This is the content of the modal.</p>
                    <p>test</p>
                </Modal>
            )}
        </div>
    );
};

export default MakeTrip;