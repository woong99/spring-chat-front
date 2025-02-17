import React, { useEffect, useRef, useState, Fragment } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getCookie } from '../utils/CookieUtils';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import moment from 'moment';
import 'moment/locale/ko';
import { FaChevronLeft } from 'react-icons/fa';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const ChatPage = () => {
  const { roomId } = useParams();
  const stompClient = useRef(null);

  const [chatRoomName, setChatRoomName] = useState('');
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
  const [text, setText] = useState('');
  const [myInfo, setMyInfo] = useState(null);
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const observeRef = useRef(null);
  const [scrollHeight, setScrollHeight] = useState(0);
  const containerRef = useRef(null);

  const onIntersect = ([entry]) => {
    if (entry.isIntersecting) {
      fetchChatHistory();
    }
  };

  useIntersectionObserver(observeRef, onIntersect, hasMore);

  /**
   * 무한 스크롤 시 스크롤 위치 유지
   */
  useEffect(() => {
    if (!containerRef) return;

    if (containerRef.current && !isScrolledToBottom) {
      const scrollTop = containerRef.current.scrollHeight - scrollHeight;
      containerRef.current.scrollTop = scrollTop;
      setScrollHeight(containerRef.current.scrollHeight);
    }
  }, [messages.length]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'instant' });
    }
  };

  useEffect(() => {
    if (isScrolledToBottom) {
      setTimeout(() => {
        scrollToBottom();
        setIsScrolledToBottom(false);
      }, 100);
    }
  }, [isScrolledToBottom]);

  useEffect(() => {
    fetchMyInfo();
    fetchChatHistory();
    stompHandler().connect();

    return () => stompHandler().disconnect();
  }, [roomId]);

  // 채팅 내역 조회
  const fetchChatHistory = async () => {
    if (isLoading || !hasMore) return;

    try {
      setIsLoading(true);
      const response = await api.get(`/chat/${roomId}/messages`, {
        params: {
          page,
        },
      });

      const newMessages = response.data.data.messages;
      setMessages((prev) => [...prev, ...newMessages]);
      setHasMore(response.data.data.hasMore);
      setPage((prev) => prev + 1);
      setChatRoomName(response.data.data.chatRoomName);
      scrollToBottom();
      setIsScrolledToBottom(false);
    } catch (error) {
      console.error('채팅 내역 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMyInfo = async () => {
    try {
      const response = await api.get('/auth/me');
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
              new SockJS(
                `${api.defaults.baseURL.replace('/api/v1', '')}/ws-stomp`
              ),
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
                setIsScrolledToBottom(true);
                setMessages((prev) => {
                  return [JSON.parse(message.body), ...prev];
                });
              });
            },

            onWebSocketClose: (close) => {
              console.log('Disconnected: ', close);
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
    <div className='flex flex-col h-full'>
      {/* 헤더 */}
      <div className='bg-white px-4 py-5 flex items-center border-b relative shadow-sm'>
        <button
          onClick={() => navigate(-1)}
          className='text-gray-600 hover:text-gray-800 absolute left-6'
        >
          <FaChevronLeft size={24} />
        </button>
        <span className='font-semibold flex-1 text-center text-lg'>
          {chatRoomName}
        </span>
      </div>

      {/* 메시지 영역 */}
      <div className='flex-1 overflow-y-auto px-4' ref={containerRef}>
        <div ref={observeRef} />
        {/* 로딩 인디케이터 */}
        <div id='scroll-target' className='py-2 text-center'>
          {isLoading && (
            <div className='text-gray-500 text-sm'>메시지를 불러오는 중...</div>
          )}
        </div>

        <div className='py-4'>
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
                    message.sender === myInfo.id ? 'items-end' : 'items-start'
                  }`}
                >
                  {message.sender !== myInfo.id && isShowNickname && (
                    <span className='text-sm text-gray-600 mb-1 ml-2'>
                      {message.nickname}
                    </span>
                  )}

                  <div className='flex items-end gap-2'>
                    {message.sender === myInfo.id && isShowTime && (
                      <span className='text-xs text-gray-500 mb-1'>
                        {moment(message.sendAt).format('HH:mm')}
                      </span>
                    )}
                    <div
                      className={`break-all px-4 py-2 text-gray-800 rounded-2xl
                        ${
                          message.sender === myInfo.id
                            ? 'bg-indigo-500 text-white rounded-tr-none'
                            : 'bg-gray-100 rounded-tl-none'
                        }`}
                    >
                      {message.message}
                    </div>
                    {message.sender !== myInfo.id && isShowTime && (
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
        <div ref={scrollRef} />
      </div>

      {/* 입력 영역 */}
      <div className='px-4 py-3 border-t bg-white'>
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
  );
};

export default ChatPage;
