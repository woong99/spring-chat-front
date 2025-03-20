import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaArrowLeft } from 'react-icons/fa';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { Api, CreateGroupChatRoom, ChatRoomId } from '../../api/Api';
import { useInView } from 'react-intersection-observer';
import { MoonLoader } from 'react-spinners';
import { useDebouncedCallback } from 'use-debounce';
import { AllFriendInfo } from '../../api/Api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SelectFriend from './SelectFriend';
import EnterChatRoomName from './EnterChatRoomName';
import CommonModal from '../common/CommonModal';

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
  const inputRef = useRef<HTMLInputElement>(null);
  const { ref, inView } = useInView();

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

  return (
    <CommonModal
      isOpen={isOpen}
      closeModal={handleClose}
      customStyles={{
        content: { height: '80vh' },
      }}
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
          <SelectFriend
            inputValue={inputValue}
            handleSearchChange={handleSearchChange}
            handleFriendSelect={handleFriendSelect}
            selectedFriends={selectedFriends}
            data={data}
            isLoading={isLoading}
            isFetchingNextPage={isFetchingNextPage}
            ref={ref}
          />
        ) : (
          <EnterChatRoomName
            selectedFriends={selectedFriends}
            roomName={roomName}
            setRoomName={setRoomName}
          />
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
    </CommonModal>
  );
};

export default FriendListModal;
