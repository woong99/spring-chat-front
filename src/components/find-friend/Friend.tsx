import { FaUser } from 'react-icons/fa';

const Friend = () => {
  return (
    <button className='w-full text-left flex items-center justify-between px-4 bg-white rounded-xl shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 border border-gray-100 hover:border-indigo-100 min-h-[64px]'>
      {/* 사용자 프로필 이미지 */}
      <div className='mr-3 flex-shrink-0'>
        <div className='w-10 h-10 rounded-2xl bg-indigo-100 overflow-hidden flex items-center justify-center'>
          <FaUser className='text-indigo-500 text-xl' />
        </div>
      </div>

      <div className='flex-1 min-w-0 flex flex-col justify-center'>
        <div className='flex items-center gap-2'>
          <h3 className='font-semibold text-gray-800 line-clamp-1'>
            친구 이름
          </h3>
        </div>
        <p className='text-sm text-gray-500 mt-1 line-clamp-1'>친구 소개</p>
      </div>
      <div className='text-right ml-4 flex items-center justify-center h-full'></div>
    </button>
  );
};

export default Friend;
