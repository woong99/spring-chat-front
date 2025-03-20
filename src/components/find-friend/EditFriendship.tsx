import { FaBan, FaTimes, FaUserPlus } from 'react-icons/fa';
import { IoChatbubbleEllipses } from 'react-icons/io5';
import {
  Api,
  AllFriendInfo,
  ChangeFriendshipStatus,
  FriendshipStatus,
  ScrollPagingResponse,
} from '../../api/Api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InfiniteData } from '@tanstack/react-query';
import { MoonLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ProfileImage from '../common/ProfileImage';
import CommonModal from '../common/CommonModal';

const EditFriendship = ({
  isModalOpen,
  closeModal,
  friend,
}: {
  isModalOpen: boolean;
  closeModal: () => void;
  friend: AllFriendInfo;
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 친구 상태 변경
  const { mutate: changeFriendshipStatus, isPending: isLoading } = useMutation({
    mutationFn: (data: ChangeFriendshipStatus) =>
      Api.changeFriendshipStatus(data),
    onSuccess: (_, variables) => {
      // 캐시에서 현재 상태 가져오기
      const queries = queryClient.getQueriesData<
        InfiniteData<ScrollPagingResponse<AllFriendInfo>>
      >({
        queryKey: ['all-friends'],
      });

      // 각 쿼리 캐시 업데이트
      queries.forEach(([queryKey]) => {
        queryClient.setQueryData(
          queryKey,
          (
            old: InfiniteData<ScrollPagingResponse<AllFriendInfo>> | undefined
          ) => {
            if (!old) return old;

            // 각 페이지의 데이터 업데이트
            const updatedPages = old.pages.map((page) => ({
              ...page,
              data: page.data
                .map((item: AllFriendInfo) => {
                  // 현재 필터가 'FRIEND'이고 차단으로 변경된 경우 null 반환
                  if (
                    queryKey[2] === 'FRIEND' &&
                    variables.status === 'BLOCKED' &&
                    item.id === friend.id
                  ) {
                    return null;
                  }
                  // 현재 필터가 'BLOCKED'이고 친구로 변경된 경우 null 반환
                  if (
                    queryKey[2] === 'BLOCKED' &&
                    variables.status === 'FRIEND' &&
                    item.id === friend.id
                  ) {
                    return null;
                  }
                  // 해당 사용자의 상태 업데이트
                  if (item.id === friend.id) {
                    return { ...item, friendshipStatus: variables.status };
                  }
                  return item;
                })
                .filter((item): item is AllFriendInfo => item !== null),
            }));

            return {
              ...old,
              pages: updatedPages,
            };
          }
        );
      });

      closeModal();

      if (variables.status === 'BLOCKED') {
        toast.success('사용자를 차단했습니다.');
      } else if (variables.status === 'FRIEND') {
        toast.success('친구 상태가 변경되었습니다.');
      }
    },
    onError: () => {
      toast.error('수정에 실패했습니다.');
    },
  });

  // 채팅방 이동
  const { mutate: getPrivateChatRoomId } = useMutation({
    mutationFn: () => Api.getPrivateChatRoomId(friend.id),
    onSuccess: (data) => {
      navigate(`/chat/${data.chatRoomId}`);
    },
    onError: () => {
      toast.error('채팅방 이동에 실패했습니다.');
    },
  });

  const renderHandleButton = () => {
    if (friend.friendshipStatus === 'FRIEND') {
      return (
        <div className='flex gap-3'>
          <span
            className='px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-full border border-indigo-100 shadow-sm hover:shadow-md hover:bg-indigo-100 hover:border-indigo-200 hover:text-indigo-700 transition-all duration-200 cursor-pointer'
            onClick={() => getPrivateChatRoomId()}
          >
            <div className='flex items-center gap-1.5'>
              <IoChatbubbleEllipses className='text-indigo-500' />
              <span>채팅</span>
            </div>
          </span>
          <span
            className='px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-full border border-red-100 shadow-sm hover:shadow-md hover:bg-red-100 hover:border-red-200 hover:text-red-700 transition-all duration-200 cursor-pointer'
            onClick={() => handleSave('BLOCKED')}
          >
            <div className='flex items-center gap-1.5'>
              <FaBan className='text-red-500' />
              <span>차단</span>
            </div>
          </span>
        </div>
      );
    } else if (friend.friendshipStatus === 'BLOCKED') {
      return (
        <span
          className='px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-full border border-red-100 shadow-sm hover:shadow-md hover:bg-red-100 hover:border-red-200 hover:text-red-700 transition-all duration-200 cursor-pointer'
          onClick={() => handleSave('FRIEND')}
        >
          <div className='flex items-center gap-1.5'>
            <FaBan className='text-red-500' />
            <span>차단 해제</span>
          </div>
        </span>
      );
    } else {
      return (
        <span
          className='px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 rounded-full border border-green-100 shadow-sm hover:shadow-md hover:bg-green-100 hover:border-green-200 hover:text-green-700 transition-all duration-200 cursor-pointer'
          onClick={() => handleSave('FRIEND')}
        >
          <div className='flex items-center gap-1.5'>
            <FaUserPlus className='text-green-500' />
            <span>친구 추가</span>
          </div>
        </span>
      );
    }
  };

  const handleSave = (status: FriendshipStatus) => {
    const data = {
      friendId: friend.id,
      status: status,
    };

    changeFriendshipStatus(data);
  };

  return (
    <>
      <CommonModal isOpen={isModalOpen} closeModal={closeModal}>
        <div className='flex flex-col gap-6 relative'>
          {isLoading && (
            <div className='absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-3 rounded-2xl animate-fadeIn'>
              <MoonLoader color='#4f46e5' size={48} speedMultiplier={0.8} />
            </div>
          )}
          <div className='flex items-center justify-between'>
            <button
              onClick={() => {
                closeModal();
              }}
              className='text-gray-400 hover:text-gray-600 transition-colors'
            >
              <FaTimes className='w-6 h-6' />
            </button>
          </div>

          <div className='flex flex-col items-center gap-4'>
            <div className='relative'>
              <ProfileImage
                profileImageUrl={friend.profileImageUrl}
                defaultIconTextSize='text-4xl'
                width='24'
                height='24'
              />
            </div>
            <div className='text-center'>
              <h3 className='text-xl font-semibold text-gray-800'>
                {friend.nickname}
              </h3>
              <p className='text-gray-500 mt-1'>{friend.introduction}</p>
            </div>
          </div>

          <div className='w-full border-t border-gray-100 pt-4 mt-4'>
            <div className='flex justify-center gap-3'>
              {renderHandleButton()}
            </div>
          </div>
        </div>
      </CommonModal>
    </>
  );
};

export default EditFriendship;
