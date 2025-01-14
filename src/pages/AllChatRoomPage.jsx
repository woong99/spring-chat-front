import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../utils/CookieUtils';
import { FaPlus } from 'react-icons/fa';

const AllChatRoomPage = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const navigate = useNavigate();

  // 초기 채팅방 목록 로딩
  useEffect(() => {
    fetchChatRooms();
  }, []);

  // 채팅방 목록 가져오기
  const fetchChatRooms = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8080/api/v1/chat-room/all-list',
        {
          headers: {
            Authorization: `Bearer ${getCookie('accessToken')}`,
          },
        }
      );
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
              </div>
              <div className='text-right ml-4 flex flex-col items-end justify-center h-full'>
                <p className='text-xs text-gray-400 whitespace-nowrap'>
                  {room.lastSendAt &&
                    moment(room.lastSendAt).format('MM/DD HH:mm')}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllChatRoomPage;
