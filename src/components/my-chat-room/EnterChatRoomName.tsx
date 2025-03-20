import { useEffect, useRef, useState } from 'react';
import { AllFriendInfo } from '../../api/Api';

const EnterChatRoomName = ({
  selectedFriends,
  roomName,
  setRoomName,
}: {
  selectedFriends: AllFriendInfo[];
  roomName: string;
  setRoomName: (value: string) => void;
}) => {
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
  }, []);

  return (
    <>
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
    </>
  );
};

export default EnterChatRoomName;
