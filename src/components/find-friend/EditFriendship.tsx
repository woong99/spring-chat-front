import Modal from 'react-modal';
import { FaBan, FaTimes, FaUser, FaUserPlus } from 'react-icons/fa';
import { IoChatbubbleEllipses } from 'react-icons/io5';
import {
  Api,
  AllFriendInfo,
  ChangeFriendshipStatus,
  FriendshipStatus,
} from '../../api/Api';
import { useMutation } from '@tanstack/react-query';
import { MoonLoader } from 'react-spinners';
import { toast } from 'react-toastify';

const EditFriendship = ({
  isModalOpen,
  closeModal,
  friend,
}: {
  isModalOpen: boolean;
  closeModal: () => void;
  friend: AllFriendInfo;
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
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '60%',
      maxWidth: '400px',
      borderRadius: '16px',
      padding: '24px',
      boxShadow:
        '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      animation: 'modalPopIn 0.3s ease-out',
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
`;
  document.head.appendChild(style);

  const { mutate: changeFriendshipStatus, isPending: isLoading } = useMutation({
    mutationFn: (data: ChangeFriendshipStatus) =>
      Api.changeFriendshipStatus(data),
    onSuccess: (_, variables) => {
      friend.friendshipStatus = variables.status;
    },
    onError: () => {
      toast.error('수정에 실패했습니다.');
    },
  });

  const renderHandleButton = () => {
    if (friend.friendshipStatus === 'FRIEND') {
      return (
        <div className='flex gap-3'>
          <span className='px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-full border border-indigo-100 shadow-sm hover:shadow-md hover:bg-indigo-100 hover:border-indigo-200 hover:text-indigo-700 transition-all duration-200 cursor-pointer'>
            <div className='flex items-center gap-1.5'>
              <IoChatbubbleEllipses className='text-indigo-500' />
              <span>채팅</span>
            </div>
          </span>
          <span
            className='px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-full border border-red-100 shadow-sm hover:shadow-md hover:bg-red-100 hover:border-red-200 hover:text-red-700 transition-all duration-200 cursor-pointer'
            onClick={() => handleSave('BLOCKED')}
          >
            <div className='flex items-center gap-1.5'>
              <FaBan className='text-red-500' />
              <span>차단</span>
            </div>
          </span>
        </div>
      );
    } else if (friend.friendshipStatus === 'BLOCKED') {
      return (
        <span
          className='px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-full border border-red-100 shadow-sm hover:shadow-md hover:bg-red-100 hover:border-red-200 hover:text-red-700 transition-all duration-200 cursor-pointer'
          onClick={() => handleSave('FRIEND')}
        >
          <div className='flex items-center gap-1.5'>
            <FaBan className='text-red-500' />
            <span>차단 해제</span>
          </div>
        </span>
      );
    } else {
      return (
        <span
          className='px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 rounded-full border border-green-100 shadow-sm hover:shadow-md hover:bg-green-100 hover:border-green-200 hover:text-green-700 transition-all duration-200 cursor-pointer'
          onClick={() => handleSave('FRIEND')}
        >
          <div className='flex items-center gap-1.5'>
            <FaUserPlus className='text-green-500' />
            <span>친구 추가</span>
          </div>
        </span>
      );
    }
  };

  const handleSave = (status: FriendshipStatus) => {
    const data = {
      friendId: friend.id,
      status: status,
    };

    changeFriendshipStatus(data);
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={modalStyles}
        shouldCloseOnOverlayClick={false}
      >
        <div className='flex flex-col gap-6 relative'>
          {isLoading && (
            <div className='absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-3 rounded-2xl animate-fadeIn'>
              <MoonLoader color='#4f46e5' size={48} speedMultiplier={0.8} />
            </div>
          )}
          <div className='flex items-center justify-between'>
            <button
              onClick={() => {
                closeModal();
              }}
              className='text-gray-400 hover:text-gray-600 transition-colors'
            >
              <FaTimes className='w-6 h-6' />
            </button>
          </div>

          <div className='flex flex-col items-center gap-4'>
            <div className='relative'>
              {friend.profileImageUrl ? (
                <img
                  src={friend.profileImageUrl}
                  alt='프로필 이미지'
                  className='w-24 h-24 rounded-2xl object-cover'
                />
              ) : (
                <div className='w-24 h-24 rounded-2xl bg-indigo-100 overflow-hidden flex items-center justify-center'>
                  <FaUser className='text-indigo-500 text-4xl' />
                </div>
              )}
            </div>
            <div className='text-center'>
              <h3 className='text-xl font-semibold text-gray-800'>
                {friend.nickname}
              </h3>
              <p className='text-gray-500 mt-1'>{friend.introduction}</p>
            </div>
          </div>

          <div className='w-full border-t border-gray-100 pt-4 mt-4'>
            <div className='flex justify-center gap-3'>
              {renderHandleButton()}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EditFriendship;
