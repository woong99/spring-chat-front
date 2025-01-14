import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../utils/CookieUtils';

const ChatRoomPage = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const navigate = useNavigate();

  // 채팅방 목록 가져오기
  const fetchChatRooms = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8080/api/v1/chat-room/list',
        {
          headers: {
            Authorization: `Bearer ${getCookie('accessToken')}`,
          },
        }
      );
      console.log(response.data.data);
      setChatRooms(response.data.data);
    } catch (error) {
      console.error('채팅방 목록 조회 실패:', error);
    }
  };

  // 채팅방 생성 함수
  const createChatRoom = async (e) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    try {
      await axios.post(
        'http://localhost:8080/api/v1/chat-room',
        { name: newRoomName },
        {
          headers: {
            Authorization: `Bearer ${getCookie('accessToken')}`,
          },
        }
      );
      setNewRoomName('');
      fetchChatRooms(); // 채팅방 생성 후 목록 새로고침
    } catch (error) {
      console.error('채팅방 생성 실패:', error);
    }
  };

  useEffect(() => {
    fetchChatRooms();
  }, []);

  return (
    <div className='max-w-screen-md mx-auto p-4'>
      <h2 className='text-2xl font-bold mb-6 text-gray-800'>채팅방 목록</h2>

      {/* 채팅방 생성 폼 */}
      <form onSubmit={createChatRoom} className='mb-8 flex gap-2'>
        <input
          type='text'
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          placeholder='새로운 채팅방 이름을 입력하세요'
          className='flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-gray-600 placeholder-gray-400'
        />
        <button
          type='submit'
          className='px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors font-medium shadow-sm hover:shadow flex items-center gap-2'
        >
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M12 4v16m8-8H4'
            />
          </svg>
          방 만들기
        </button>
      </form>

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
                  {room.name}
                </h3>
                <span className='text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full whitespace-nowrap'>
                  {room.participantCount}명 참여중
                </span>
              </div>
              <p className='text-sm text-gray-500 mt-1.5 line-clamp-1'>
                {room.lastChatMessage || '새로운 채팅방이 생성되었습니다.'}
              </p>
            </div>
            <div className='text-right ml-4 flex flex-col items-end justify-center h-full'>
              <p className='text-xs text-gray-400 whitespace-nowrap'>
                {room.lastChatSendAt
                  ? moment(room.lastChatSendAt).format('MM/DD HH:mm')
                  : moment().format('MM/DD HH:mm')}
              </p>
              {room.unreadCount > 0 && (
                <span className='inline-flex items-center justify-center min-w-[20px] h-5 bg-red-500 text-white text-xs font-medium rounded-full px-1.5 mt-1.5'>
                  {room.unreadCount}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatRoomPage;
