import React from 'react';
import { FaCheck, FaSearch, FaUserFriends } from 'react-icons/fa';
import ProfileImage from '../common/ProfileImage';
import { MoonLoader } from 'react-spinners';
import { AllFriendInfo, ScrollPagingResponse } from '../../api/Api';
import { InfiniteData } from '@tanstack/react-query';

const SelectFriend = ({
  inputValue,
  handleSearchChange,
  handleFriendSelect,
  selectedFriends,
  data,
  isLoading,
  isFetchingNextPage,
  ref,
}: {
  inputValue: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFriendSelect: (friend: AllFriendInfo) => void;
  selectedFriends: AllFriendInfo[];
  data: InfiniteData<ScrollPagingResponse<AllFriendInfo>, unknown> | undefined;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  ref: (node?: Element | null) => void;
}) => {
  return (
    <>
      {/* 검색창 */}
      <div className='relative mb-6'>
        <input
          type='text'
          placeholder='친구 검색'
          className='w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200'
          value={inputValue}
          onChange={handleSearchChange}
        />
        <FaSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5' />
      </div>

      {/* 친구 목록 */}
      <div className='flex-1 overflow-y-auto custom-scrollbar'>
        {data?.pages.map((page, i) => (
          <div key={i}>
            {page.data.map((friend) => (
              <div
                key={friend.id}
                className='flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors'
                onClick={() => handleFriendSelect(friend)}
              >
                <ProfileImage
                  profileImageUrl={friend.profileImageUrl}
                  defaultIconTextSize='text-lg'
                  containerClassName='mr-3'
                  width='10'
                  height='10'
                />
                <div className='flex-1'>
                  <h3 className='text-sm font-medium text-gray-900'>
                    {friend.nickname}
                  </h3>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedFriends.some((f) => f.id === friend.id)
                      ? 'bg-indigo-500 border-indigo-500'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedFriends.some((f) => f.id === friend.id) && (
                    <FaCheck className='w-2.5 h-2.5 text-white' />
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={ref} className='h-4'>
          {isFetchingNextPage && (
            <div className='flex justify-center items-center py-4'>
              <MoonLoader color='#4f46e5' size={8} speedMultiplier={0.8} />
            </div>
          )}
        </div>

        {/* 친구가 없는 경우 */}
        {!isLoading && data?.pages[0].data.length === 0 && (
          <div className='flex flex-col items-center justify-center py-16 text-gray-400 h-[calc(100%-1rem)]'>
            <FaUserFriends className='w-16 h-16 mb-4 animate-bounce' />
            <p className='text-lg font-medium mb-2'>친구가 없습니다</p>
            <p className='text-sm text-gray-400'>새로운 친구를 추가해보세요</p>
          </div>
        )}
      </div>
    </>
  );
};

export default SelectFriend;
