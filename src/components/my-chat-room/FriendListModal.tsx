import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import {
  FaTimes,
  FaSearch,
  FaUserFriends,
  FaCheck,
  FaArrowLeft,
} from 'react-icons/fa';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { Api, CreateGroupChatRoom, ChatRoomId } from '../../api/Api';
import { useInView } from 'react-intersection-observer';
import { MoonLoader } from 'react-spinners';
import { useDebouncedCallback } from 'use-debounce';
import { AllFriendInfo } from '../../api/Api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProfileImage from '../common/ProfileImage';

interface FriendListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FriendListModal: React.FC<FriendListModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<AllFriendInfo[]>([]);
  const [step, setStep] = useState<'select' | 'name'>('select');
  const [roomName, setRoomName] = useState('');
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView();

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
      width: '90%',
      maxWidth: '400px',
      height: '80vh',
      borderRadius: '16px',
      padding: '24px',
      boxShadow:
        '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      animation: 'modalPopIn 0.3s ease-out',
    },
  };

  // 애니메이션 스타일 추가
  useEffect(() => {
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

      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // 친구 목록 조회
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ['all-friends', searchQuery],
      queryFn: ({ pageParam = 0 }) =>
        Api.getAllFriends(pageParam, searchQuery, 'FRIEND'),
      getNextPageParam: (lastPage) => {
        if (lastPage.hasMore) {
          return lastPage.page + 1;
        }
        return undefined;
      },
      initialPageParam: 0,
    });

  // 채팅방 생성
  const { mutate: createGroupChatRoom, isPending: isCreating } = useMutation({
    mutationFn: (data: CreateGroupChatRoom) => Api.createGroupChatRoom(data),
    onSuccess: (data: ChatRoomId) => {
      navigate(`/chat/${data.chatRoomId}`);
    },
    onError: () => {
      toast.error('채팅방 생성에 실패했습니다.');
    },
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 검색어 입력 시 디바운싱
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    inputRef.current?.focus();
  }, 300);

  // 검색어 입력 시 디바운싱
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };

  // 친구 선택/해제 처리
  const handleFriendSelect = (friend: AllFriendInfo) => {
    setSelectedFriends((prev) => {
      const isSelected = prev.some((f) => f.id === friend.id);
      if (isSelected) {
        return prev.filter((f) => f.id !== friend.id);
      } else {
        return [...prev, friend];
      }
    });
  };

  // 선택 완료 처리
  const handleComplete = () => {
    // 첫 번째 단계일 때 채팅방 이름 입력 단계로 이동
    if (step === 'select') {
      setStep('name');
      return;
    }

    // 두 번째 단계일 때 채팅방 생성 요청
    createGroupChatRoom({
      friendIds: selectedFriends.map((friend) => friend.id),
      chatRoomName: roomName,
    });
  };

  // 모달 닫기 처리
  const handleClose = () => {
    setInputValue('');
    setSelectedFriends([]);
    setSearchQuery('');
    setStep('select');
    setRoomName('');
    onClose();
  };

  // 뒤로가기 처리
  const handleBack = () => {
    setStep('select');
    setRoomName('');
  };

  // 스크롤 이벤트 처리
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // 왼쪽 그라데이션 표시 여부
    setShowLeftGradient(container.scrollLeft > 10);

    // 오른쪽 그라데이션 표시 여부
    const isAtEnd =
      container.scrollWidth - container.scrollLeft <=
      container.clientWidth + 10;
    setShowRightGradient(!isAtEnd);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      // 초기 상태 설정
      handleScroll();
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [step]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      style={modalStyles}
      shouldCloseOnOverlayClick={false}
    >
      <div className='flex flex-col h-full'>
        {(isLoading || isCreating) && (
          <div className='absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-3 rounded-2xl animate-fadeIn'>
            <MoonLoader color='#4f46e5' size={48} speedMultiplier={0.8} />
            {isCreating && (
              <p className='text-indigo-500 font-medium'>채팅방 생성 중...</p>
            )}
          </div>
        )}
        <div className='flex items-center justify-between mb-6'>
          {step === 'name' ? (
            <>
              <button
                onClick={handleBack}
                className='text-gray-400 hover:text-gray-600 transition-colors'
              >
                <FaArrowLeft className='w-6 h-6' />
              </button>
              <h2 className='text-xl font-semibold text-gray-800'>
                채팅방 이름 지정
              </h2>
              <button
                onClick={handleClose}
                className='text-gray-400 hover:text-gray-600 transition-colors'
              >
                <FaTimes className='w-6 h-6' />
              </button>
            </>
          ) : (
            <>
              <h2 className='text-xl font-semibold text-gray-800'>
                대화 상대 선택
              </h2>
              <button
                onClick={handleClose}
                className='text-gray-400 hover:text-gray-600 transition-colors'
              >
                <FaTimes className='w-6 h-6' />
              </button>
            </>
          )}
        </div>

        {step === 'select' ? (
          <>
            {/* 검색창 */}
            <div className='relative mb-6'>
              <input
                type='text'
                placeholder='친구 검색'
                className='w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200'
                value={inputValue}
                onChange={handleSearchChange}
              />
              <FaSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5' />
            </div>

            {/* 친구 목록 */}
            <div className='flex-1 overflow-y-auto custom-scrollbar'>
              {data?.pages.map((page, i) => (
                <div key={i}>
                  {page.data.map((friend) => (
                    <div
                      key={friend.id}
                      className='flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors'
                      onClick={() => handleFriendSelect(friend)}
                    >
                      <ProfileImage
                        profileImageUrl={friend.profileImageUrl}
                        defaultIconTextSize='text-lg'
                        containerClassName='mr-3'
                        width='10'
                        height='10'
                      />
                      <div className='flex-1'>
                        <h3 className='text-sm font-medium text-gray-900'>
                          {friend.nickname}
                        </h3>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          selectedFriends.some((f) => f.id === friend.id)
                            ? 'bg-indigo-500 border-indigo-500'
                            : 'border-gray-300'
                        }`}
                      >
                        {selectedFriends.some((f) => f.id === friend.id) && (
                          <FaCheck className='w-2.5 h-2.5 text-white' />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              <div ref={ref} className='h-4'>
                {isFetchingNextPage && (
                  <div className='flex justify-center items-center py-4'>
                    <MoonLoader
                      color='#4f46e5'
                      size={8}
                      speedMultiplier={0.8}
                    />
                  </div>
                )}
              </div>

              {/* 친구가 없는 경우 */}
              {!isLoading && data?.pages[0].data.length === 0 && (
                <div className='flex flex-col items-center justify-center py-16 text-gray-400 h-[calc(100%-1rem)]'>
                  <FaUserFriends className='w-16 h-16 mb-4 animate-bounce' />
                  <p className='text-lg font-medium mb-2'>친구가 없습니다</p>
                  <p className='text-sm text-gray-400'>
                    새로운 친구를 추가해보세요
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className='flex-1 flex flex-col'>
            <div className='mb-6'>
              <p className='text-sm text-gray-500 mb-2'>
                선택한 친구: {selectedFriends.length}명
              </p>
              <div className='relative'>
                <div
                  ref={scrollContainerRef}
                  className='flex overflow-x-auto gap-2 pb-2 scrollbar-hide'
                  onScroll={handleScroll}
                >
                  {selectedFriends.map((friend) => (
                    <div
                      key={friend.id}
                      className='flex-shrink-0 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm whitespace-nowrap'
                    >
                      {friend.nickname}
                    </div>
                  ))}
                </div>
                {showRightGradient && (
                  <div className='absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none'></div>
                )}
                {showLeftGradient && (
                  <div className='absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent pointer-events-none'></div>
                )}
              </div>
            </div>
            <div className='flex-1'>
              <input
                type='text'
                placeholder='채팅방 이름을 입력하세요'
                className='w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200'
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                autoFocus
              />
            </div>
          </div>
        )}

        {/* 하단 버튼 */}
        {(selectedFriends.length > 0 || step === 'name') && (
          <div className='mt-4 pt-4 border-t border-gray-200'>
            <button
              onClick={handleComplete}
              disabled={(step === 'name' && !roomName.trim()) || isCreating}
              className='w-full bg-indigo-500 text-white py-3 rounded-xl font-medium hover:bg-indigo-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed'
            >
              {step === 'select'
                ? `선택 완료 (${selectedFriends.length}명)`
                : '채팅방 만들기'}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default FriendListModal;
