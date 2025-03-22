import { Fragment, useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { Client } from '@stomp/stompjs';
import { getCookie } from '../utils/CookieUtils';
import { FaChevronLeft } from 'react-icons/fa';
import ProfileImage from '../components/common/ProfileImage';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { Api } from '../api/Api';
import { useQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import PlusAndBlockButton from '../components/chat/PlusAndBlockButton';
import ClearBlockButton from '../components/chat/ClearBlockButton';

const ChatPage = () => {
  type Message = {
    sender: number;
    nickname: string;
    message: string;
    sendAt: number;
    profileImageUrl?: string;
  };

  dayjs.locale('ko');

  const { roomId } = useParams();
  const stompClient = useRef<Client>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
  const [text, setText] = useState('');
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollHeight, setScrollHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView();

  // 내 정보 조회
  const { data: myInfo } = useQuery({
    queryKey: ['myInfo'],
    queryFn: () => Api.getMyInfo(),
  });

  // 채팅방 정보 조회
  const { data: chatRoomInfo } = useQuery({
    queryKey: ['chatRoomInfo', roomId],
    queryFn: () => Api.getChatRoomInfo(roomId as string),
  });

  useEffect(() => {
    if (inView && hasMore) {
      fetchChatHistory();
    }
  }, [inView, hasMore]);

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
    fetchChatHistory();
    stompHandler().connect();

    // 새로고침 시 채팅 연결 해제
    const handleBeforeUnload = () => {
      console.log('beforeunload');
      stompHandler().disconnect();
    };

    // 새로고침 이벤트 리스너 추가
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      stompHandler().disconnect();
    };
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

      const newMessages = response.data.data.data;
      setMessages((prev) => [...prev, ...newMessages]);
      setHasMore(response.data.data.hasMore);
      setPage((prev) => prev + 1);
      scrollToBottom();
      setIsScrolledToBottom(false);
    } catch (error) {
      console.error('채팅 내역 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const stompHandler = () => {
    return {
      connect: () => {
        if (!stompClient.current) {
          stompClient.current = new Client({
            webSocketFactory: () =>
              new SockJS(`${import.meta.env.VITE_WEBSOCKET_URL}/ws-stomp`),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,

            connectHeaders: {
              Authorization: `Bearer ${getCookie('accessToken')}`,
            },

            onConnect: (conn) => {
              console.log('Connected: ' + conn);
              stompClient.current?.subscribe(`/sub/${roomId}`, (message) => {
                console.log('Received: ', JSON.parse(message.body));
                setIsScrolledToBottom(true);
                setMessages((prev) => {
                  return [JSON.parse(message.body), ...prev];
                });
              });

              stompClient.current?.subscribe('/sub/global', (message) => {
                const body = JSON.parse(message.body);
                if (body.type === 'SHUTDOWN') {
                  console.log(
                    'Server is restarting, attempting to reconnect...'
                  );
                  stompClient.current?.deactivate();
                  stompClient.current = null;
                  stompHandler().connect();
                }
                console.log('Received: ', JSON.parse(message.body));
              });
            },

            onWebSocketClose: (close) => {
              console.log('Disconnected: ', close);
            },

            onWebSocketError: (error) => {
              console.error('WebSocketError: ', error);
            },

            onStompError: (frame) => {
              if (frame.body === 'UNA') {
                alert('로그인 후 이용해주세요.');
                navigate('/login');
              }
              console.error('StompError: ', frame.body);
            },
          });
          stompClient.current.activate();
        }

        return () => {
          stompClient.current?.deactivate();
        };
      },

      sendMessage: () => {
        if (text) {
          stompClient.current?.publish({
            destination: `/pub/chat/${roomId}`,
            body: JSON.stringify({
              message: text,
              type: 'MESSAGE',
            }),
          });

          setText('');
        }
      },

      disconnect: () => {
        console.log('Disconnected');
        if (stompClient.current) {
          stompClient.current.publish({
            destination: `/pub/chat/${roomId}`,
            body: JSON.stringify({
              message: 'disconnect',
              type: 'DISCONNECT',
            }),
          });
          stompClient.current.deactivate();
          stompClient.current = null;
        }
      },
    };
  };

  // 1대1 채팅방인 경우 친구 상태에 따른 버튼 렌더링
  const renderFriendshipStatus = () => {
    if (chatRoomInfo?.chatRoomType === 'PRIVATE') {
      if (chatRoomInfo?.users[0].friendshipStatus === 'BLOCKED') {
        return (
          <ClearBlockButton
            roomId={roomId as string}
            chatRoomInfo={chatRoomInfo}
          />
        );
      } else if (chatRoomInfo?.users[0].friendshipStatus === null) {
        return (
          <PlusAndBlockButton
            roomId={roomId as string}
            chatRoomInfo={chatRoomInfo}
          />
        );
      }
    }
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
          {chatRoomInfo?.chatRoomName}
        </span>
      </div>

      {/* 메시지 영역 */}
      <div
        className='flex-1 overflow-y-auto custom-scrollbar px-4'
        ref={containerRef}
      >
        {/* 1대1 채팅방일 경우 친구 상태에 따른 버튼 랜더링 */}
        {renderFriendshipStatus()}

        <div ref={ref} />
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
              dayjs(message.sendAt).format('YYYY-MM-DD') !=
                dayjs(array[index - 1].sendAt).format('YYYY-MM-DD');

            // 닉네임 표시 여부
            const isShowNickname =
              index === 0 ||
              array[index - 1].sender !== message.sender ||
              showDateDivider;

            // 시간 표시 여부
            const isShowTime =
              index === array.length - 1 ||
              array[index + 1].sender !== message.sender ||
              dayjs(array[index + 1].sendAt).format('HH:mm') !==
                dayjs(message.sendAt).format('HH:mm') ||
              dayjs(array[index + 1].sendAt).format('YYYY-MM-DD') !=
                dayjs(message.sendAt).format('YYYY-MM-DD');

            return (
              <Fragment key={index}>
                {showDateDivider && (
                  <div className='flex justify-center my-4'>
                    <div className='bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-500'>
                      {dayjs(message.sendAt).format('YYYY년 M월 D일 dddd')}
                    </div>
                  </div>
                )}
                <div
                  className={`mb-1 flex flex-col ${
                    message.sender === myInfo?.id ? 'items-end' : 'items-start'
                  }`}
                >
                  {/* 상대방 메시지의 프로필과 닉네임 (조건부 표시) */}
                  {message.sender !== myInfo?.id && isShowNickname && (
                    <div className='flex items-center'>
                      <ProfileImage
                        profileImageUrl={message.profileImageUrl}
                        defaultIconTextSize='text-xl'
                        width='10'
                        height='10'
                      />
                      <span className='text-sm text-gray-500 ml-2'>
                        {message.nickname}
                      </span>
                    </div>
                  )}

                  {/* 상대방 메시지 내용 (항상 표시) */}
                  {message.sender !== myInfo?.id && (
                    <div className='flex items-end mt-1'>
                      <div className={`ml-10 flex items-end`}>
                        <div className='break-all px-3 py-1.5 rounded-lg text-sm bg-gray-100 text-gray-800 rounded-tl-none'>
                          {message.message}
                        </div>
                        {isShowTime && (
                          <span className='text-xs text-gray-500 ml-1'>
                            {dayjs(message.sendAt).format('H:mm')}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 내 메시지 (기존과 동일) */}
                  {message.sender === myInfo?.id && (
                    <div className='flex items-end gap-1 justify-end'>
                      {isShowTime && (
                        <span className='text-xs text-gray-500'>
                          {dayjs(message.sendAt).format('H:mm')}
                        </span>
                      )}
                      <div className='break-all px-3 py-1.5 rounded-lg text-sm bg-indigo-500 text-white rounded-tr-none'>
                        {message.message}
                      </div>
                    </div>
                  )}
                </div>
              </Fragment>
            );
          })}
        </div>
        <div ref={scrollRef} />
      </div>

      {/* 입력 영역 */}
      <div className='px-4 py-3 border-t bg-white'>
        {chatRoomInfo?.chatRoomType === 'PRIVATE' &&
        chatRoomInfo?.users[0].friendshipStatus === 'BLOCKED' ? (
          <div className='text-center py-2 text-sm text-gray-500'>
            차단된 사용자와는 대화할 수 없습니다.
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default ChatPage;
