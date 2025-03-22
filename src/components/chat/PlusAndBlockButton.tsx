import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FaBan, FaUserPlus } from 'react-icons/fa';
import {
  Api,
  ChangeFriendshipStatus,
  ChatRoomInfo,
  FriendshipStatus,
} from '../../api/Api';
import { toast } from 'react-toastify';

const PlusAndBlockButton = ({
  roomId,
  chatRoomInfo,
}: {
  roomId: string;
  chatRoomInfo: ChatRoomInfo;
}) => {
  const queryClient = useQueryClient();

  // 친구 상태 변경
  const { mutate: changeFriendshipStatus } = useMutation({
    mutationFn: ({ friendId, status }: ChangeFriendshipStatus) =>
      Api.changeFriendshipStatus({
        friendId,
        status,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatRoomInfo', roomId] });
    },
    onError: () => {
      toast.error('친구 상태 변경에 실패했습니다.');
    },
  });

  // 친구 상태 변경
  const handleFriendStatus = (status: FriendshipStatus) => {
    if (!chatRoomInfo?.users[0].id) return;
    changeFriendshipStatus({
      friendId: chatRoomInfo.users[0].id,
      status,
    });
  };

  return (
    <div className='bg-white border-b'>
      <div className='px-4 py-3.5 text-center border-b border-gray-100'>
        <p className='text-gray-600 font-medium text-sm'>
          친구로 등록되지 않은 사용자입니다.
        </p>
        <p className='text-xs text-gray-500 mt-1'>
          친구 추가 후 더 많은 기능을 사용할 수 있습니다.
        </p>
      </div>
      <div className='grid grid-cols-2 gap-2 px-4 py-3'>
        <button
          onClick={() => handleFriendStatus('FRIEND')}
          className='flex items-center justify-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-sm transition-all duration-200 hover:shadow-md active:scale-95'
        >
          <FaUserPlus className='w-3.5 h-3.5' />
          <span>친구 추가</span>
        </button>
        <button
          onClick={() => handleFriendStatus('BLOCKED')}
          className='flex items-center justify-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-sm transition-all duration-200 hover:shadow-md active:scale-95'
        >
          <FaBan className='w-3.5 h-3.5' />
          <span>차단하기</span>
        </button>
      </div>
    </div>
  );
};

export default PlusAndBlockButton;
