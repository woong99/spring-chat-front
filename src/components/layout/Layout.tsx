import { Outlet, useLocation } from 'react-router-dom';
import Navigation from './Navigation';

const Layout = () => {
  const location = useLocation();
  const hideNavigation = location.pathname.includes('/chat/'); // 채팅방 페이지에서는 네비게이션 숨김

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-md mx-auto h-screen flex flex-col bg-white shadow-lg'>
        <div className='flex-1 overflow-hidden'>
          <Outlet />
        </div>
        {!hideNavigation && <Navigation />}
      </div>
    </div>
  );
};

export default Layout;
