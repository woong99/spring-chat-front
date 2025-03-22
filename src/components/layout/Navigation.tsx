import { FaComment, FaUserFriends } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className='bg-white border-t h-16'>
      <div className='flex justify-around h-full'>
        <NavLink
          to='/friends'
          className={({ isActive }) =>
            `flex flex-col items-center py-3 px-5 ${
              isActive ? 'text-indigo-600' : 'text-gray-500'
            }`
          }
        >
          <FaUserFriends size={24} />
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
      </div>
    </nav>
  );
};

export default Navigation;
