import { FaBan } from 'react-icons/fa';
import { IoChatbubbleEllipses } from 'react-icons/io5';
import { AllFriendInfo, Api } from '../../api/Api';
import { useState } from 'react';
import EditFriendship from './EditFriendship';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProfileImage from '../common/ProfileImage';

const Friend = ({ friend }: { friend: AllFriendInfo }) => {
  const navigate = useNavigate();

  const { mutate: getPrivateChatRoomId } = useMutation({
    mutationFn: () => Api.getPrivateChatRoomId(friend.id),
    onSuccess: (data) => {
      navigate(`/chat/${data.chatRoomId}`);
    },
    onError: () => {
      toast.error('채팅방 이동에 실패했습니다.');
    },
  });

  const [isEditFriendshipModalOpen, setIsEditFriendshipModalOpen] =
    useState(false);

  const renderFriendshipStatus = () => {
    if (friend.friendshipStatus === 'FRIEND') {
      return (
        <span
          className='px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-full border border-indigo-100 shadow-sm hover:shadow-md hover:bg-indigo-100 hover:border-indigo-200 hover:text-indigo-700 transition-all duration-200'
          onClick={(e) => {
            e.stopPropagation();
            getPrivateChatRoomId();
          }}
        >
          <div className='flex items-center gap-1.5 cursor-pointer'>
            <IoChatbubbleEllipses className='text-indigo-500 group-hover:text-indigo-600' />
            <span>채팅</span>
          </div>
        </span>
      );
    } else if (friend.friendshipStatus === 'BLOCKED') {
      return (
        <span className='px-3 py-1.5 text-sm font-medium text-gray-500 bg-gray-50 rounded-full border border-gray-100 shadow-sm transition-all duration-200'>
          <div className='flex items-center gap-1.5'>
            <FaBan className='text-gray-400' />
            <span>차단</span>
          </div>
        </span>
      );
    }
  };

  return (
    <>
      <div
        className='w-full text-left flex items-center justify-between px-4 bg-white rounded-xl shadow-sm transition-all duration-200 border border-gray-100 min-h-[64px] cursor-pointer'
        onClick={() => setIsEditFriendshipModalOpen(true)}
      >
        {/* 사용자 프로필 이미지 */}
        <ProfileImage
          profileImageUrl={friend.profileImageUrl}
          containerClassName='mr-3'
          defaultIconTextSize='text-xl'
          width='10'
          height='10'
        />

        <div className='flex-1 min-w-0 flex flex-col justify-center'>
          <div className='flex items-center gap-2'>
            <h3 className='font-semibold text-gray-800 line-clamp-1'>
              {friend.nickname}
            </h3>
          </div>
          <p className='text-sm text-gray-500 mt-1 line-clamp-1'>
            {friend.introduction}
          </p>
        </div>
        <div className='text-right ml-4 flex items-center justify-center h-full'>
          {renderFriendshipStatus()}
        </div>
      </div>
      {isEditFriendshipModalOpen && (
        <EditFriendship
          isModalOpen={isEditFriendshipModalOpen}
          closeModal={() => setIsEditFriendshipModalOpen(false)}
          friend={friend}
        />
      )}
    </>
  );
};

export default Friend;
