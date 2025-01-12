import react from "react";
import ReactModal from "react-modal";

const Modal = ({ isOpen, onClose, children }) => {
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            ariaHideApp={false}
            style={{
                content: {
                    maxWidth: "500px",
                    margin: "auto",
                    padding: "20px",
                },
            }}
        >
            <button onClick={onClose}>Close</button>
            <div>{children}</div>
        </ReactModal>
    );
};

export default Modal;