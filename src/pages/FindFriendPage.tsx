import Header from '../components/layout/Header';
import MyInfo from '../components/find-friend/MyInfo';
import FriendList from '../components/find-friend/FriendList';

const FindFriendPage = () => {
  return (
    <div className='max-w-screen-md mx-auto h-full flex flex-col'>
      {/* 헤더 */}
      <Header title='친구찾기' />

      {/* 내 프로필 */}
      <MyInfo />

      <div className='flex-1 p-4 h-[calc(100%-200px)]'>
        {/* 친구 목록 */}
        <FriendList />
      </div>
    </div>
  );
};

export default FindFriendPage;
