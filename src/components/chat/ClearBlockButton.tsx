import { FaBan, FaLock } from 'react-icons/fa';
import {
  Api,
  ChangeFriendshipStatus,
  ChatRoomInfo,
  FriendshipStatus,
} from '../../api/Api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const ClearBlockButton = ({
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
    <div className='bg-white border rounded-xl shadow-sm mx-2 my-4'>
      <div className='px-6 py-4 text-center border-b border-gray-100 flex flex-col items-center gap-2'>
        <div className='bg-red-50 p-2 rounded-full'>
          <FaLock className='w-5 h-5 text-red-500' />
        </div>
        <div>
          <p className='text-gray-800 font-semibold'>차단된 사용자입니다</p>
          <p className='text-sm text-gray-500 mt-1'>
            차단을 해제하면 대화할 수 있습니다
          </p>
        </div>
      </div>
      <div className='px-4 py-3'>
        <button
          className='w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all duration-200 hover:shadow-md active:scale-95'
          onClick={() => {
            handleFriendStatus('FRIEND');
          }}
        >
          <FaBan className='w-4 h-4' />
          <span>차단 해제하기</span>
        </button>
      </div>
    </div>
  );
};

export default ClearBlockButton;
