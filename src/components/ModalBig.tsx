import '../index.css';

interface ModalProps {
    onClose: () => void;
    children: React.ReactNode;
}

const ModalBig: React.FC<ModalProps> = ({ onClose, children }) => {
    return (
        <div className="modal h-full">
            <div className="bpopup popBig w-4/5 h-[90%]">
                <div className="">
                    {children}
                </div>
                <button className="popClose" onClick={onClose}></button>
            </div>
        </div>
    );
};

export default ModalBig;