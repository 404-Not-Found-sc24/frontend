

interface ModalProps {
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
    return (
        <div className="modal">
            <div className="modal-content bpopup popBig">
                {children}
                <button className="popClose" onClick={onClose}></button>
            </div>
        </div>
    );
};

export default Modal;