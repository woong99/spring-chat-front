import { FaCog } from 'react-icons/fa';
import { useState } from 'react';
import EditMyInfo from './EditMyInfo';
import { useQuery } from '@tanstack/react-query';
import { Api } from '../../api/Api';
import ProfileImage from '../common/ProfileImage';

const MyInfo = () => {
  const { data: authInfo } = useQuery({
    queryKey: ['authInfo'],
    queryFn: () => Api.getMyInfo(),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        className='w-full text-left flex items-center justify-between bg-white hover:bg-gray-50 cursor-pointer transition-all duration-200 border-b border-gray-100 p-4 min-h-[76px]'
        onClick={openModal}
      >
        {/* 사용자 프로필 이미지 */}
        <ProfileImage
          profileImageUrl={authInfo?.profileImageUrl}
          containerClassName='mr-3'
          defaultIconTextSize='text-3xl'
          width='16'
          height='16'
        />

        <div className='flex-1 min-w-0 flex flex-col justify-center'>
          <div className='flex items-center gap-2'>
            <h3 className='font-semibold text-gray-800 line-clamp-1'>
              {authInfo?.nickname}
            </h3>
          </div>
          <p className='text-sm text-gray-500 mt-1.5 line-clamp-1'>
            {authInfo?.introduction}
          </p>
        </div>
        <div className='text-right ml-4 flex items-center justify-center h-full'>
          <FaCog className='text-gray-400 text-xl transition-all duration-200 hover:text-gray-600 hover:scale-110 cursor-pointer' />
        </div>
      </button>

      {/* 프로필 수정 모달 */}
      <EditMyInfo
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        authInfo={authInfo}
      />
    </>
  );
};

export default MyInfo;
