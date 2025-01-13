import React, { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getCookie } from '../utils/CookieUtils';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ChatPage = () => {
  const { roomId } = useParams();
  const stompClient = useRef(null);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [myInfo, setMyInfo] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchMyInfo();
    stompHandler().connect();

    return () => stompHandler().disconnect();
  }, []);

  const fetchMyInfo = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/auth/me', {
        headers: {
          Authorization: `Bearer ${getCookie('accessToken')}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      setMyInfo(response.data.data);
    } catch (error) {
      console.error(error);
      alert('로그인 후 이용해주세요.');
      // navigate('/login');
    }
  };

  const stompHandler = () => {
    return {
      connect: () => {
        if (!stompClient.current) {
          stompClient.current = new Client({
            webSocketFactory: () =>
              new SockJS('http://localhost:8080/ws-stomp'),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,

            connectHeaders: {
              Authorization: `Bearer ${getCookie('accessToken')}`,
            },

            onConnect: (conn) => {
              console.log('Connected: ' + conn);
              stompClient.current.subscribe(`/sub/${roomId}`, (message) => {
                console.log('Received: ', JSON.parse(message.body));
                setMessages((prev) => {
                  return [...prev, JSON.parse(message.body)];
                });
              });
            },

            onWebSocketClose: (close) => {
              console.log('Disconnected: ' + close);
            },

            onWebSocketError: (error) => {
              console.error('WebSocketError: ' + error);
            },

            onStompError: (frame) => {
              if (frame.body === 'UNA') {
                alert('로그인 후 이용해주세요.');
                navigate('/login');
              }
              console.error('StompError: ' + frame.body);
            },
          });
          stompClient.current.activate();
        }

        return () => {
          stompClient.current.deactivate();
        };
      },

      sendMessage: () => {
        if (text) {
          stompClient.current.publish({
            destination: `/pub/chat/${roomId}`,
            body: JSON.stringify({
              roomId: roomId,
              message: text,
            }),
          });

          setText('');
        }
      },

      disconnect: () => {
        console.log('Disconnected');
        if (stompClient.current) {
          stompClient.current.deactivate();
          stompClient.current = null;
        }
      },
    };
  };

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <div className='w-full max-w-3xl mx-auto p-4'>
        {/* 헤더 부분 */}
        <div className='bg-white rounded-t-lg shadow-sm p-4 border-b'>
          <h2 className='text-xl font-bold text-gray-800 text-center'>
            채팅방
          </h2>
        </div>

        {/* 메시지 표시 영역 */}
        <div className='bg-white h-[600px] overflow-y-auto p-4 flex flex-col-reverse'>
          {[...messages].reverse().map((message, index) => (
            <div
              key={index}
              className={`mb-4 flex flex-col ${
                message.sender === myInfo.nickname ? 'items-end' : 'items-start'
              }`}
            >
              {message.sender !== myInfo.nickname && (
                <span className='text-sm text-gray-600 mb-1 ml-2'>
                  {message.sender}
                </span>
              )}

              <div className='flex items-end gap-2'>
                <div
                  className={`break-all px-4 py-2 text-gray-800 rounded-2xl
                    ${
                      message.sender === myInfo.nickname
                        ? 'bg-indigo-500 text-white rounded-tr-none'
                        : 'bg-gray-100 rounded-tl-none'
                    }`}
                >
                  {message.message}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 입력 영역 */}
        <div className='bg-white rounded-b-lg shadow-sm p-4 border-t'>
          <form action='#' method='POST' className='flex gap-2'>
            <input
              id='text'
              name='text'
              type='text'
              required
              className='flex-1 rounded-full px-4 py-2 border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none'
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder='메시지를 입력하세요'
            />
            <button
              type='button'
              className='rounded-full bg-indigo-600 px-6 py-2 text-white font-medium hover:bg-indigo-500 transition-colors'
              onClick={stompHandler().sendMessage}
            >
              전송
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
