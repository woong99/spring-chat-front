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
      <h2 className='text-2xl font-bold mb-4'>채팅방 목록</h2>

      {/* 채팅방 생성 폼 */}
      <form onSubmit={createChatRoom} className='mb-6 flex gap-2'>
        <input
          type='text'
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          placeholder='새로운 채팅방 이름'
          className='flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
        />
        <button
          type='submit'
          className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
        >
          방 만들기
        </button>
      </form>

      <div className='space-y-2'>
        {chatRooms.map((room) => (
          <button
            key={room.id}
            className='w-full text-left flex items-center justify-between p-4 bg-white rounded-lg shadow hover:shadow-md cursor-pointer transition-shadow'
            onClick={() => navigate(`/chat/${room.id}`)}
          >
            <div>
              <h3 className='font-semibold'>{room.name}</h3>
              {room.lastMessage && (
                <p className='text-sm text-gray-500 mt-1'>
                  {room.lastMessage.length > 30
                    ? room.lastMessage.substring(0, 30) + '...'
                    : room.lastMessage}
                </p>
              )}
            </div>
            <div className='text-right'>
              <p className='text-xs text-gray-500'>
                {room.lastMessageTime &&
                  moment(room.lastMessageTime).format('MM/DD HH:mm')}
              </p>
              {room.unreadCount > 0 && (
                <span className='inline-block bg-red-500 text-white text-xs rounded-full px-2 py-1 mt-1'>
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
