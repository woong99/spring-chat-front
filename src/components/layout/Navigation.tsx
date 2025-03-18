import { FaComment, FaComments, FaUser, FaUserFriends } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className='bg-white border-t h-16'>
      <div className='flex justify-around h-full'>
        <NavLink
          to='/find-friend'
          className={({ isActive }) =>
            `flex flex-col items-center py-3 px-5 ${
              isActive ? 'text-indigo-600' : 'text-gray-500'
            }`
          }
        >
          <FaUserFriends size={24} />
          <span className='text-xs mt-1'>친구찾기</span>
        </NavLink>
        <NavLink
          to='/my-friends'
          className={({ isActive }) =>
            `flex flex-col items-center py-3 px-5 ${
              isActive ? 'text-indigo-600' : 'text-gray-500'
            }`
          }
        >
          <FaUser size={24} />
          <span className='text-xs mt-1'>친구</span>
        </NavLink>
        <NavLink
          to='/my-chats'
          className={({ isActive }) =>
            `flex flex-col items-center py-3 px-5 ${
              isActive ? 'text-indigo-600' : 'text-gray-500'
            }`
          }
        >
          <FaComment size={24} />
          <span className='text-xs mt-1'>채팅</span>
        </NavLink>
        <NavLink
          to='/all-chats'
          className={({ isActive }) =>
            `flex flex-col items-center py-3 px-5 ${
              isActive ? 'text-indigo-600' : 'text-gray-500'
            }`
          }
        >
          <FaComments size={24} />
          <span className='text-xs mt-1'>전체채팅</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default Navigation;
