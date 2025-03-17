import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EventSourcePolyfill, MessageEvent } from 'event-source-polyfill';
import { getCookie } from '../utils/CookieUtils';
import api from '../api/axios';
import moment from 'moment';
import { FaPlus } from 'react-icons/fa';

// EventSourceEventMap 인터페이스 확장
declare module 'event-source-polyfill' {
  interface EventSourceEventMap {
    UNREAD_MESSAGE_COUNT: MessageEvent;
  }
}

const MyChatRoomPage = () => {
  type ChatRoom = {
    chatRoomId: string;
    lastMessage: string | null;
    lastSendAt: string | null;
    chatRoomName: string;
    participantCount: number;
    unreadMessageCount: number;
  };

  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [newRoomName, setNewRoomName] = useState('');
  const navigate = useNavigate();

  // SSE 연결 설정
  useEffect(() => {
    console.log('SSE 연결 시작');
    const eventSource = new EventSourcePolyfill(
      `${import.meta.env.VITE_SSE_URL}/chat-room/notification/subscribe`,
      {
        headers: {
          Authorization: `Bearer ${getCookie('accessToken')}`,
        },
        heartbeatTimeout: 86400000,
        withCredentials: true,
      }
    );

    eventSource.onopen = () => {
      console.log('SSE 연결 성공');
    };

    // 채팅방 업데이트 이벤트 (새 메시지, 참여자 수 변경 등)
    eventSource.addEventListener(
      'UNREAD_MESSAGE_COUNT',
      (event: MessageEvent) => {
        const updatedRoom = JSON.parse(event.data);
        setChatRooms((prevRooms) => {
          // 채팅방 목록 중 업데이트된 채팅방을 찾아서 업데이트
          const updatedRooms = prevRooms.map((room) =>
            room.chatRoomId === updatedRoom.chatRoomId
              ? {
                  ...room,
                  unreadMessageCount: updatedRoom.unreadMessageCount,
                  lastMessage: updatedRoom.lastMessage,
                  lastSendAt: updatedRoom.lastSendAt,
                }
              : room
          );

          // lastSendAt 기준으로 내림차순 정렬 (최신 메시지가 위로, null은 가장 아래로)
          return updatedRooms.sort((a, b) => {
            // a가 null이고 b가 null이 아닌 경우, a를 뒤로
            if (a.lastSendAt === null && b.lastSendAt !== null) return 1;
            // b가 null이고 a가 null이 아닌 경우, b를 뒤로
            if (b.lastSendAt === null && a.lastSendAt !== null) return -1;
            // 둘 다 null인 경우, 순서 유지
            if (a.lastSendAt === null && b.lastSendAt === null) return 0;

            // 둘 다 null이 아닌 경우, 날짜 비교
            const dateA = new Date(a.lastSendAt);
            const dateB = new Date(b.lastSendAt);
            return dateB.getTime() - dateA.getTime(); // 내림차순 정렬
          });
        });
      }
    );

    // 에러 처리
    eventSource.onerror = (error) => {
      console.error('SSE 연결 에러:', error);
      //   eventSource.close();
    };

    // 컴포넌트 언마운트 시 연결 종료
    return () => {
      console.log('컴포넌트 언마운트');
      eventSource.close();
    };
  }, []);

  // 초기 채팅방 목록 로딩
  useEffect(() => {
    console.log('초기 채팅방 목록 로딩');
    fetchChatRooms();
  }, []);

  // 채팅방 목록 가져오기
  const fetchChatRooms = async () => {
    try {
      const response = await api.get('/chat-room/my-list');
      setChatRooms(response.data.data);
    } catch (error) {
      console.error('채팅방 목록 조회 실패:', error);
    }
  };

  // 채팅방 생성 함수
  const createChatRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    try {
      await api.post('/chat-room', { name: newRoomName });
      setNewRoomName('');
      fetchChatRooms(); // 채팅방 생성 후 목록 새로고침
    } catch (error) {
      console.error('채팅방 생성 실패:', error);
    }
  };

  // 시간 포맷 함수 추가
  const formatTime = (time: string | null) => {
    if (!time) return '';

    const messageTime = moment(time);
    const now = moment();

    if (messageTime.isSame(now, 'day')) {
      // 오늘
      return messageTime.format('HH:mm');
    } else if (messageTime.isSame(now.subtract(1, 'day'), 'day')) {
      // 어제
      return '어제';
    } else if (messageTime.isSame(now, 'year')) {
      // 이번 년도
      return messageTime.format('M월 D일');
    } else {
      // 이전 년도
      return messageTime.format('YYYY-MM-DD');
    }
  };

  return (
    <div className='max-w-screen-md mx-auto h-screen flex flex-col'>
      {/* 헤더 */}
      <div className='bg-white px-4 py-5 flex items-center border-b relative shadow-sm'>
        <span className='font-semibold flex-1 text-center text-lg'>채팅</span>
      </div>

      {/* 컨텐츠 영역 */}
      <div className='flex-1 overflow-y-auto p-4'>
        {/* 채팅방 생성 폼 */}
        <form onSubmit={createChatRoom} className='mb-6 flex gap-2'>
          <input
            type='text'
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder='새로운 채팅방 이름'
            className='flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-gray-600 placeholder-gray-400'
          />
          <button
            type='submit'
            className='px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors font-medium shadow-sm hover:shadow flex items-center gap-2'
          >
            <FaPlus size={16} />방 만들기
          </button>
        </form>

        {/* 채팅방 목록 */}
        <div className='space-y-3'>
          {chatRooms.map((room) => (
            <button
              key={room.chatRoomId}
              className='w-full text-left flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 border border-gray-100 hover:border-indigo-100 min-h-[76px]'
              onClick={() => navigate(`/chat/${room.chatRoomId}`)}
            >
              <div className='flex-1 min-w-0 flex flex-col justify-center'>
                <div className='flex items-center gap-2'>
                  <h3 className='font-semibold text-gray-800 line-clamp-1'>
                    {room.chatRoomName}
                  </h3>
                  <span className='text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full whitespace-nowrap'>
                    {room.participantCount}명 참여중
                  </span>
                </div>
                <p className='text-sm text-gray-500 mt-1.5 line-clamp-1'>
                  {room.lastMessage || '메시지가 없습니다.'}
                </p>
              </div>
              <div className='text-right ml-4 flex flex-col items-end justify-center h-full'>
                <p className='text-xs text-gray-400 whitespace-nowrap'>
                  {formatTime(room.lastSendAt)}
                </p>
                {room.unreadMessageCount > 0 && (
                  <span className='inline-flex items-center justify-center min-w-[20px] h-5 bg-red-500 text-white text-xs font-medium rounded-full px-1.5 mt-1.5'>
                    {room.unreadMessageCount}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyChatRoomPage;
