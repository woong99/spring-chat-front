import React, { useEffect, useState } from 'react';
import { FaSearch, FaTimes, FaUserPlus } from 'react-icons/fa';

const Header = ({
  searchInputRef,
  onSearch,
  searchInputValue,
}: {
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchInputValue: string;
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // 검색창이 열리면 포커스
  useEffect(() => {
    if (searchInputRef.current && isSearchOpen) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  return (
    <>
      {/* 헤더 */}
      <div className='bg-white px-4 py-4 flex items-center border-b relative shadow-sm'>
        <span className='font-semibold flex-1 text-center text-lg'>채팅</span>
        <div className='absolute right-4 flex items-center gap-2'>
          <button
            className={`w-9 h-9 rounded-xl hover:bg-indigo-50 flex items-center justify-center transition-all duration-200 group
              ${isSearchOpen ? 'bg-indigo-50' : ''}`}
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            {isSearchOpen ? (
              <FaTimes className='w-[18px] h-[18px] text-indigo-500 transition-colors duration-200' />
            ) : (
              <FaSearch className='w-[18px] h-[18px] text-gray-500 group-hover:text-indigo-500 transition-colors duration-200' />
            )}
          </button>
          <button className='w-9 h-9 rounded-xl hover:bg-indigo-50 flex items-center justify-center transition-all duration-200 group'>
            <FaUserPlus className='w-[18px] h-[18px] text-gray-500 group-hover:text-indigo-500 transition-colors duration-200' />
          </button>
        </div>
      </div>

      {/* 검색창 */}
      <div
        className={`bg-white border-b overflow-hidden transition-all duration-300 ease-in-out ${
          isSearchOpen ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className='px-4 py-3'>
          <div className='relative'>
            <input
              ref={searchInputRef}
              type='text'
              placeholder='채팅방 이름으로 검색'
              className='w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200'
              onChange={onSearch}
              value={searchInputValue}
            />
            <FaSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5' />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
