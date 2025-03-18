import { useInfiniteQuery } from '@tanstack/react-query';
import { Api, AllFriendInfo, ScrollPagingResponse } from '../../api/api';
import Friend from './Friend';
import { useIntersectionObserver } from '../../hooks/useIntersectionObjectser';
import { useRef, useState } from 'react';
import { PulseLoader } from 'react-spinners';
import { FaSearch, FaUserFriends } from 'react-icons/fa';
import { useDebouncedCallback } from 'use-debounce';

const FriendList = () => {
  const observeRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');

  const {
    data: friendPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['all-friends', searchQuery],
    queryFn: ({ pageParam = 0 }) => Api.getAllFriends(pageParam, searchQuery),
    getNextPageParam: (lastPage: ScrollPagingResponse<AllFriendInfo>) => {
      if (!lastPage.hasMore) return undefined;
      return lastPage.page + 1;
    },
    initialPageParam: 0,
  });

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    inputRef.current?.focus();
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };

  const onIntersect: IntersectionObserverCallback = (entries) => {
    const [entry] = entries;
    if (entry && entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  useIntersectionObserver(observeRef, onIntersect, hasNextPage);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center py-8'>
        <PulseLoader color='#4f46e5' size={12} />
      </div>
    );
  }

  return (
    <div className='space-y-4 h-full'>
      {/* 검색바 */}
      <div className='bg-white px-4 pb-3 shadow-sm z-10 h-[52px]'>
        <div className='relative'>
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

        <div ref={observeRef} className='h-4'>
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
