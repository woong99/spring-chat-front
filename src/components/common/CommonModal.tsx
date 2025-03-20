import Modal from 'react-modal';

const CommonModal = ({
  isOpen,
  closeModal,
  customStyles,
  children,
}: {
  isOpen: boolean;
  closeModal: () => void;
  customStyles?: {
    overlay?: React.CSSProperties;
    content?: React.CSSProperties;
  };
  children: React.ReactNode;
}) => {
  // 모달 스타일 설정
  const modalStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease-in-out',
      ...customStyles?.overlay,
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '90%',
      maxWidth: '400px',
      borderRadius: '16px',
      padding: '24px',
      boxShadow:
        '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      animation: 'modalPopIn 0.3s ease-out',
      ...customStyles?.content,
    },
  };

  // 애니메이션 스타일 수정
  const style = document.createElement('style');
  style.textContent = `
  @keyframes modalPopIn {
    0% {
      opacity: 0;
      transform: translate(-50%, -48%) scale(0.95);
    }
    100% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }

  @keyframes modalShake {
    0%, 100% {
      transform: translate(-50%, -50%) scale(1);
    }
    25% {
      transform: translate(-50%, -50%) scale(0.98) translateX(-2px);
    }
    75% {
      transform: translate(-50%, -50%) scale(0.98) translateX(2px);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.3s ease-in-out;
  }

  .ReactModal__Content--after-open {
    animation: modalPopIn 0.3s ease-out;
  }

  .modal-shake {
    animation: modalShake 0.5s ease-in-out;
  }

  .ReactModal__Body--open {
    overflow: hidden;
  }
`;
  document.head.appendChild(style);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={modalStyles}
      shouldCloseOnOverlayClick={false}
      bodyOpenClassName='ReactModal__Body--open'
    >
      {children}
    </Modal>
  );
};

export default CommonModal;
