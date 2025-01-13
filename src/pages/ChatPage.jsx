import React, { useEffect, useRef, useState, Fragment } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getCookie } from '../utils/CookieUtils';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/ko';

const ChatPage = () => {
  const { roomId } = useParams();
  const stompClient = useRef(null);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [myInfo, setMyInfo] = useState(null);

  const navigate = useNavigate();

  const scrollRef = useRef(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      const element = scrollRef.current;
      const { scrollHeight, clientHeight } = element;
      element.scrollTop = scrollHeight - clientHeight;
    }
  };

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  }, [messages]);

  const fetchChatHistory = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/chat/${roomId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${getCookie('accessToken')}`,
          },
        }
      );
      setMessages(response.data.data);
    } catch (error) {
      console.error('채팅 내역 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchMyInfo();
    fetchChatHistory();
    stompHandler().connect();

    return () => stompHandler().disconnect();
  }, [roomId]);

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
                  return [JSON.parse(message.body), ...prev];
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
        <div className='bg-white h-[600px] overflow-y-auto p-4' ref={scrollRef}>
          <div className='flex flex-col'>
            {[...messages].reverse().map((message, index, array) => {
              // 날짜 구분선 표시 여부
              const showDateDivider =
                index === 0 ||
                moment(message.sendAt).format('YYYY-MM-DD') !=
                  moment(array[index - 1].sendAt).format('YYYY-MM-DD');

              // 닉네임 표시 여부
              const isShowNickname =
                index === 0 ||
                array[index - 1].sender !== message.sender ||
                showDateDivider;

              // 시간 표시 여부
              const isShowTime =
                index === array.length - 1 ||
                array[index + 1].sender !== message.sender ||
                moment(array[index + 1].sendAt).format('HH:mm') !==
                  moment(message.sendAt).format('HH:mm') ||
                moment(array[index + 1].sendAt).format('YYYY-MM-DD') !=
                  moment(message.sendAt).format('YYYY-MM-DD');

              return (
                <Fragment key={index}>
                  {showDateDivider && (
                    <div className='flex justify-center my-4'>
                      <div className='bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-500'>
                        {moment(message.sendAt).format('YYYY년 M월 D일 dddd')}
                      </div>
                    </div>
                  )}
                  <div
                    className={`mb-1 flex flex-col ${
                      message.sender === myInfo.nickname
                        ? 'items-end'
                        : 'items-start'
                    }`}
                  >
                    {message.sender !== myInfo.nickname && isShowNickname && (
                      <span className='text-sm text-gray-600 mb-1 ml-2'>
                        {message.sender}
                      </span>
                    )}

                    <div className='flex items-end gap-2'>
                      {message.sender === myInfo.nickname && isShowTime && (
                        <span className='text-xs text-gray-500 mb-1'>
                          {moment(message.sendAt).format('HH:mm')}
                        </span>
                      )}
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
                      {message.sender !== myInfo.nickname && isShowTime && (
                        <span className='text-xs text-gray-500 mb-1'>
                          {moment(message.sendAt).format('HH:mm')}
                        </span>
                      )}
                    </div>
                  </div>
                </Fragment>
              );
            })}
          </div>
        </div>

        {/* 입력 영역 */}
        <div className='bg-white rounded-b-lg shadow-sm p-4 border-t'>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              stompHandler().sendMessage();
            }}
            className='flex gap-2'
          >
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
              type='submit'
              className='rounded-full bg-indigo-600 px-6 py-2 text-white font-medium hover:bg-indigo-500 transition-colors'
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
