import { NavLink } from 'react-router-dom';
import { FaComments, FaUserFriends } from 'react-icons/fa';

const Navigation = () => {
  return (
    <nav className='bg-white border-t'>
      <div className='flex justify-around'>
        <NavLink
          to='/'
          className={({ isActive }) =>
            `flex flex-col items-center py-3 px-5 ${
              isActive ? 'text-indigo-600' : 'text-gray-500'
            }`
          }
        >
          <FaUserFriends size={24} />
          <span className='text-xs mt-1'>전체 채팅방</span>
        </NavLink>
        <NavLink
          to='/my-chats'
          className={({ isActive }) =>
            `flex flex-col items-center py-3 px-5 ${
              isActive ? 'text-indigo-600' : 'text-gray-500'
            }`
          }
        >
          <FaComments size={24} />
          <span className='text-xs mt-1'>내 채팅방</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default Navigation;
