import { useInfiniteQuery } from '@tanstack/react-query';
import {
  Api,
  AllFriendInfo,
  ScrollPagingResponse,
  FriendshipStatusFilter,
} from '../../api/Api';
import Friend from './Friend';
import { useRef, useState, useEffect } from 'react';
import { PulseLoader } from 'react-spinners';
import {
  FaSearch,
  FaUserFriends,
  FaUser,
  FaBan,
  FaChevronDown,
} from 'react-icons/fa';
import { useDebouncedCallback } from 'use-debounce';
import { useInView } from 'react-intersection-observer';

const statusOptions = [
  { value: 'ALL', label: '전체', icon: FaUserFriends },
  { value: 'FRIEND', label: '친구', icon: FaUser },
  { value: 'BLOCKED', label: '차단', icon: FaBan },
] as const;

const FriendList = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState<FriendshipStatusFilter>('ALL');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  const {
    data: friendPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['all-friends', searchQuery, status],
    queryFn: ({ pageParam = 0 }) =>
      Api.getAllFriends(pageParam, searchQuery, status),
    getNextPageParam: (lastPage: ScrollPagingResponse<AllFriendInfo>) => {
      if (!lastPage.hasMore) return undefined;
      return lastPage.page + 1;
    },
    initialPageParam: 0,
  });

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // 상태 필터 변경 시
  const handleStatusChange = (newStatus: FriendshipStatusFilter) => {
    setStatus(newStatus);
    setIsDropdownOpen(false);
  };

  // 무한 스크롤
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center py-8'>
        <PulseLoader color='#4f46e5' size={12} />
      </div>
    );
  }

  const selectedOption = statusOptions.find(
    (option) => option.value === status
  )!;

  return (
    <div className='space-y-4 h-full'>
      {/* 검색바 */}
      <div className='bg-white px-4 pb-3 shadow-sm z-10 h-[52px]'>
        <div className='flex gap-2'>
          <div className='relative flex-1'>
            <input
              ref={inputRef}
              type='text'
              placeholder='친구 이름으로 검색'
              value={inputValue}
              onChange={handleSearchChange}
              className='w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
              autoFocus
            />
            <FaSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5' />
          </div>
          <div className='relative w-32' ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className='w-full px-3 py-2 text-left border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white hover:bg-gray-50 transition-colors'
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <selectedOption.icon className='w-4 h-4 text-gray-500' />
                  <span className='text-gray-700'>{selectedOption.label}</span>
                </div>
                <FaChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
              </div>
            </button>
            {isDropdownOpen && (
              <div className='absolute w-full mt-1 py-1 bg-white border border-gray-200 rounded-xl shadow-lg'>
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleStatusChange(option.value)}
                    className={`w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-indigo-50 transition-colors ${
                      status === option.value
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-700'
                    }`}
                  >
                    <option.icon
                      className={`w-4 h-4 ${status === option.value ? 'text-indigo-500' : 'text-gray-500'}`}
                    />
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 친구 목록 */}
      <div
        className='space-y-2 px-4 overflow-y-auto custom-scrollbar'
        style={{ height: 'calc(100% - 52px)' }}
      >
        {friendPages?.pages.map((page) =>
          page.data.map((friend: AllFriendInfo) => (
            <Friend key={friend.id} friend={friend} />
          ))
        )}

        <div ref={ref}>
          {isFetchingNextPage && (
            <div className='flex justify-center items-center py-4'>
              <PulseLoader color='#4f46e5' size={8} />
            </div>
          )}
        </div>

        {/* 검색 결과가 없을 때 */}
        {friendPages?.pages[0].data.length === 0 && (
          <div className='flex flex-col items-center justify-center py-16 text-gray-400'>
            <FaUserFriends className='w-16 h-16 mb-4 animate-bounce' />
            <p className='text-lg font-medium mb-2'>검색 결과가 없습니다</p>
            <p className='text-sm text-gray-400'>
              다른 검색어로 다시 시도해보세요
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendList;
